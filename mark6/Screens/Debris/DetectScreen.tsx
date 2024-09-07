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

// Fetch the latest image from Firebase Storage based on timestamp metadata
async function fetchLatestImage() {
  const storage = getStorage();
  const storageRef = ref(storage, 'images');

  try {
    const result = await listAll(storageRef);
    if (result.items.length === 0) {
      throw new Error("No images found in the bucket");
    }

    const itemsWithTimestamps = await Promise.all(
      result.items.map(async (item) => {
        const metadata = await getMetadata(item);
        const timestamp = metadata.customMetadata?.timestamp || '1970-01-01T00:00:00Z';
        return { item, timestamp };
      })
    );

    itemsWithTimestamps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const latestItem = itemsWithTimestamps[0].item;
    const timestamp = itemsWithTimestamps[0].timestamp;  // Extract the timestamp

    const url = await getDownloadURL(latestItem);
    return { url, timestamp };  // Return both url and timestamp
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

    console.log("Inference result:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return `Date: ${format(date, 'yyyy-MM-dd')}, Time: ${format(date, 'h:mm a')}`;

}

export default function DetectScreen() {
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null);
  const [scaledDimensions, setScaledDimensions] = useState<{ width: number, height: number } | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWarningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    async function fetchAndAnalyzeImage() {
      try {
        const { url, timestamp } = await fetchLatestImage();  // Destructure the response
        setImageUrl(url);
        setTimestamp(timestamp);  // Set the timestamp

        Image.getSize(url, (width, height) => {
          setImageDimensions({ width, height });
        });

        const result = await sendImageToRoboflow(url);
        setInferenceResult(result);
      } catch (error) {
        console.error("Error during image fetch and analysis:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndAnalyzeImage();
  }, []);

  useEffect(() => {
    if (imageDimensions) {
      const { width: originalWidth, height: originalHeight } = imageDimensions;
      const windowWidth = Dimensions.get('window').width - 20; // Adjust for padding if necessary

      const calculatedHeight = calculateImageHeight(originalWidth, originalHeight, windowWidth);
      setScaledHeight(calculatedHeight); // Dynamically set the scaled height
    }
  }, [imageDimensions]);

  useEffect(() => {
    if (inferenceResult && imageDimensions) {
      const { width: originalWidth, height: originalHeight } = imageDimensions;
      const { width: scaledWidth, height: scaledHeight } = scaledDimensions || { width: 0, height: 0 };

      const totalImageArea = scaledWidth * scaledHeight;

      const totalBoundingBoxArea = inferenceResult.predictions
        .filter((prediction: any) => prediction.confidence > 0.5)
        .reduce((totalArea: number, prediction: any) => {
          const boundingBoxArea = prediction.width * prediction.height;
          return totalArea + boundingBoxArea;
        }, 0);

      const severityPercentage = (totalBoundingBoxArea / totalImageArea) * 100;
      setSeverity(severityPercentage);
    }
  }, [inferenceResult, imageDimensions, scaledDimensions]);

  useEffect(() => {
    if (severity !== null && severity >= 50) {
      setWarningVisible(true);
    } else {
      setWarningVisible(false); // Optionally hide warning if severity is below 50 or null
    }
  }, [severity]);

  const handleCloseWarning = () => {
    setWarningVisible(false);
  };

  const renderBoundingBoxes = () => {
    if (!inferenceResult || !inferenceResult.predictions || !scaledDimensions || !imageDimensions) {
      return null;
    }
  
    const { width: originalWidth, height: originalHeight } = imageDimensions;
    const { width: scaledWidth, height: scaledHeight } = scaledDimensions;
  
    // Check if scaledHeight and scaledWidth are not null before rendering the SVG
    if (!scaledHeight || !scaledWidth) {
      return null;
    }

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
                <Rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  stroke="#c7fc02"
                  strokeWidth="2"
                  fill="transparent"
                />
                <SvgText
                  x={x + 4}
                  y={y - 5}
                  fill="#c7fc02"
                  fontSize="14"
                  fontWeight="bold"
                >
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
      {/* Render Image and Bounding Boxes */}
      {imageUrl && scaledHeight ? (
        <View style={[styles.imageContainer, { height: scaledHeight }]}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, { height: scaledHeight }]}
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
            {isWarningVisible && <DebrisWarningAlert isVisible={isWarningVisible} onClose={handleCloseWarning} message={'Water contamination is high!'} />}
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



