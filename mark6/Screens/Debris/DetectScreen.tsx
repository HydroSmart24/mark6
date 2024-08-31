import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { Text } from '../../components/Themed';
import SeverityGauge from '../../components/Guage/SeverityGauge';
import DebrisNumGauge from '../../components/Guage/DebrisNumGauge';
import DetectInfo from '../../components/Buttons/DetectInfo';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import axios from "axios";
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

// Fetch the latest image from Firebase Storage
async function fetchLatestImage() {
  const storage = getStorage();
  const storageRef = ref(storage, 'images');

  try {
    const result = await listAll(storageRef);
    if (result.items.length === 0) {
      throw new Error("No images found in the bucket");
    }

    const latestItem = result.items[result.items.length - 1];
    const url = await getDownloadURL(latestItem);
    return url;
  } catch (error) {
    console.error("Error fetching the latest image:", error);
    throw error;
  }
}

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

export default function DetectScreen() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null);
  const [scaledDimensions, setScaledDimensions] = useState<{ width: number, height: number } | null>(null);

  useEffect(() => {
    async function fetchAndAnalyzeImage() {
      try {
        const url = await fetchLatestImage();
        setImageUrl(url);

        // Get image dimensions
        Image.getSize(url, (width, height) => {
          setImageDimensions({ width, height });
        });

        const result = await sendImageToRoboflow(url);
        setInferenceResult(result);
      } catch (error) {
        console.error("Error during image fetch and analysis:", error);
      }
    }

    fetchAndAnalyzeImage();
  }, []);

  useEffect(() => {
    if (imageDimensions) {
      const { width, height } = imageDimensions;
      const windowWidth = Dimensions.get('window').width;
      const aspectRatio = width / height;
      const windowHeight = windowWidth / aspectRatio;

      setScaledDimensions({
        width: windowWidth,
        height: windowHeight,
      });
    }
  }, [imageDimensions]);

  // Function to render bounding boxes with manual adjustments
  const renderBoundingBoxes = () => {
    if (!inferenceResult || !inferenceResult.predictions || !scaledDimensions || !imageDimensions) {
      return null;
    }
  
    // Adjustments to fine-tune the bounding box position and size
    const xOffset = -24; // Horizontal adjustment
    const yOffset = -22; // Vertical adjustment
    const widthOffset = 0; // Width adjustment
    const heightOffset = 1; // Height adjustment
  
    return (
      <Svg
        height={scaledDimensions.height}
        width={scaledDimensions.width}
        style={styles.svg}
      >
        {inferenceResult.predictions.map((prediction: any, index: number) => {
          // Convert normalized coordinates to pixel values
          const x = (prediction.x * scaledDimensions.width / imageDimensions.width) + xOffset;
          const y = (prediction.y * scaledDimensions.height / imageDimensions.height) + yOffset;
          const width = (prediction.width * scaledDimensions.width / imageDimensions.width) + widthOffset;
          const height = (prediction.height * scaledDimensions.height / imageDimensions.height) + heightOffset;
  
          console.log(`Prediction ${index}: x=${x}, y=${y}, width=${width}, height=${height}`);
  
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
                fill="#c7fc02" // Text color
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
      <View style={styles.imageContainer}>
        {imageUrl && scaledDimensions ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, { width: scaledDimensions.width, height: scaledDimensions.height }]}
              resizeMode="contain" // Ensures the image fits within the container
            />
            {renderBoundingBoxes()}
          </View>
        ) : (
          <Text>Loading Image...</Text>
        )}
      </View>

      <View style={styles.itemsContainer}>
        <View style={styles.item}>
          <SeverityGauge value={20} size={200} />
        </View>
        <View style={styles.item}>
          <DebrisNumGauge value={3} size={200} />
        </View>
      </View>
      <DetectInfo title="More Info" colorType={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '90%',
    marginVertical: 10,
    marginTop: -110,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  itemsContainer: {
    width: '90%',
    height: 150,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: '70%',
  },
});
