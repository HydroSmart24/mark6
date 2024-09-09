import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { Text } from '../../components/Themed';
import SeverityGauge from '../../components/Guage/SeverityGauge';
import DebrisNumGauge from '../../components/Guage/DebrisNumGauge';
import DetectInfo from '../../components/Buttons/DetectInfo';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import axios from "axios";
import { format } from 'date-fns';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import Loading from '../../components/Loading/BasicLoading';
import ReusableText from '../../components/Text/ReusableText';
import DebrisWarningAlert from '../../components/AlertModal/DebrisWarningAlert';
import { HighDebris } from '../../utils/Notification/HighDebris';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth for v9+
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore v9+ functions
import { app } from '../../firebase/firebaseConfig'; // Import your Firebase config


// Fetch the latest image from Firebase Storage based on timestamp metadata (full date and time)
async function fetchLatestImage() {
  const storage = getStorage();
  const storageRef = ref(storage, 'images');

  try {
    // List all images in the storage folder
    const result = await listAll(storageRef);

    if (result.items.length === 0) {
      console.error("No images found in the bucket");
      throw new Error("No images found in the bucket");
    }

    // Fetch metadata for each image and extract the custom timestamp
    const itemsWithTimestamps = await Promise.all(
      result.items.map(async (item) => {
        const metadata = await getMetadata(item);
        const timestamp = metadata.customMetadata?.timestamp || '1970-01-01T00:00:00Z'; // Default timestamp if missing
        return { item, timestamp };
      })
    );

    // Log the fetched timestamps to ensure they're correct
    console.log("Fetched timestamps: ", itemsWithTimestamps.map(i => i.timestamp));

    // Sort items by the full timestamp (comparing both date and time)
    itemsWithTimestamps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Log the sorted timestamps to ensure correct order
    console.log("Sorted timestamps: ", itemsWithTimestamps.map(i => i.timestamp));

    // Fetch the latest item (most recent timestamp)
    const latestItem = itemsWithTimestamps[0].item;
    const timestamp = itemsWithTimestamps[0].timestamp;

    const url = await getDownloadURL(latestItem); // Get the URL of the latest image
    return { url, timestamp };
  } catch (error) {
    console.error("Error fetching the latest image:", error);
    throw error;
  }
}

// Function to calculate the scaled height based on the image's aspect ratio and screen width
const calculateImageHeight = (imageWidth: number, imageHeight: number, containerWidth: number): number => {
  const aspectRatio = imageWidth / imageHeight;
  return containerWidth / aspectRatio;
};

// Send image URL to Roboflow for inference
async function sendImageToRoboflow(imageUrl: string) {
  try {
    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/debris-model/6",
      params: {
        api_key: "6llYC7hFHWo8LCfUzecp",
        image: imageUrl,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in inference:", error);
    throw error;
  }
}

// Format the timestamp for display
function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return `Date: ${format(date, 'yyyy-MM-dd')}, Time: ${format(date, 'h:mm a')}`;
}

export default function DetectScreen() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null);
  const [scaledDimensions, setScaledDimensions] = useState<{ width: number, height: number } | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWarningVisible, setWarningVisible] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch user data from Firestore
    async function fetchUserData() {
      try {
        const auth = getAuth(app); // Get Auth instance
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userUid = currentUser.uid;
          setUid(userUid);

          // Fetch the user's pushToken from the 'users' collection in Firestore
          const db = getFirestore(app); // Get Firestore instance
          const userDocRef = doc(db, 'users', userUid); // Create reference to the user's document
          const userDocSnap = await getDoc(userDocRef); // Fetch document snapshot

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setPushToken(userData?.pushtoken); // Assuming pushToken is stored in userDoc
          } else {
            console.error("No user document found in Firestore.");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch the latest image and analyze it on component mount
    async function fetchAndAnalyzeImage() {
      try {
        const { url, timestamp } = await fetchLatestImage(); // Fetch latest image from Firebase
        setImageUrl(url);
        setTimestamp(timestamp);

        // Get the image dimensions
        Image.getSize(url, (width, height) => {
          setImageDimensions({ width, height });
        });

        // Perform inference
        const result = await sendImageToRoboflow(url);
        setInferenceResult(result);
      } catch (error) {
        console.error("Error fetching and analyzing image:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndAnalyzeImage();
  }, []); // The empty array ensures this only runs once when the component mounts

  useEffect(() => {
    if (imageDimensions) {
      const { width: originalWidth, height: originalHeight } = imageDimensions;
      const windowWidth = Dimensions.get('window').width - 20; // Adjust for padding if necessary
      const calculatedHeight = calculateImageHeight(originalWidth, originalHeight, windowWidth);

      setScaledDimensions({
        width: windowWidth,
        height: calculatedHeight,
      });
    }
  }, [imageDimensions]);

  useEffect(() => {
    if (inferenceResult && imageDimensions) {
      const totalBoundingBoxArea = inferenceResult.predictions
        .filter((prediction: any) => prediction.confidence > 0.5)
        .reduce((totalArea: number, prediction: any) => totalArea + (prediction.width * prediction.height), 0);

      const totalImageArea = (scaledDimensions?.width || 0) * (scaledDimensions?.height || 0);
      const severityPercentage = (totalBoundingBoxArea / totalImageArea) * 100;
      setSeverity(severityPercentage);
    }
  }, [inferenceResult, imageDimensions, scaledDimensions]);

  useEffect(() => {
    if (severity !== null && severity >= 50 && pushToken && uid) {
      setWarningVisible(true);

      // Call the HighDebris function when the condition is met
      HighDebris(pushToken, uid)
        .then(() => console.log('Notification sent and added to Firestore'))
        .catch(error => console.error('Error sending notification:', error));

    } else {
      setWarningVisible(false);
    }
  }, [severity, , pushToken, uid]);

  const handleCloseWarning = () => {
    setWarningVisible(false);
  };

  const renderBoundingBoxes = () => {
    if (!inferenceResult || !scaledDimensions || !imageDimensions) {
      return null;
    }

    const { width: originalWidth, height: originalHeight } = imageDimensions;
    const { width: scaledWidth, height: scaledHeight } = scaledDimensions;

    return (
      <Svg height={scaledHeight} width={scaledWidth} style={styles.svg}>
        {inferenceResult.predictions
          .filter((prediction: any) => prediction.confidence > 0.4)
          .map((prediction: any, index: number) => {
            const x = (prediction.x * scaledWidth / originalWidth) - (prediction.width * scaledWidth / originalWidth) / 2;
            const y = (prediction.y * scaledHeight / originalHeight) - (prediction.height * scaledHeight / originalHeight) / 2;
            const width = (prediction.width * scaledWidth / originalWidth);
            const height = (prediction.height * scaledHeight / originalHeight);

            return (
              <React.Fragment key={index}>
                <Rect x={x} y={y} width={width} height={height} stroke="#c7fc02" strokeWidth="2" fill="transparent" />
                <SvgText x={x + 4} y={y - 5} fill="#c7fc02" fontSize="14" fontWeight="bold">
                  {`${Math.round(prediction.confidence * 100)}%`}
                </SvgText>
              </React.Fragment>
            );
          })}
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <Loading visible={loading} />
      {imageUrl && scaledDimensions ? (
        <View style={[styles.imageContainer, { height: scaledDimensions.height }]}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, { height: scaledDimensions.height }]}
            resizeMode="contain"
          />
          {renderBoundingBoxes()}
        </View>
      ) : (
        <Text>Loading Image...</Text>
      )}

      <ReusableText text={formatTimestamp(timestamp)} color="#9B9A9A" />

      <View style={styles.itemsContainer}>
        <View style={styles.item}>
          <SeverityGauge value={severity || 0} size={200} />
        </View>
        <View style={styles.item}>
          <DebrisNumGauge value={inferenceResult ? inferenceResult.predictions.length : 0} size={200} />
        </View>
      </View>

      {isWarningVisible && (
        <DebrisWarningAlert isVisible={isWarningVisible} onClose={handleCloseWarning} message={'Water contamination is high!'} />
      )}

      <DetectInfo title="More Info" colorType={1} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  imageContainer: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: "#000",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    marginTop: -30,
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  itemsContainer: {
    width: '90%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 30, // Adjusted margin to control spacing
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    // Remove fixed height
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    marginBottom: 10,
    height: 100,
    // Use auto height or set a min-height if needed
  },
});



