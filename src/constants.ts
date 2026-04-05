export interface LayerInfo {
  name: string;
  type: 'conv' | 'pool' | 'flatten' | 'dense' | 'input';
  shape: string;
  description: string;
  details: string;
}

export const CNN_LAYERS: LayerInfo[] = [
  {
    name: "Input Layer",
    type: 'input',
    shape: "28x28x1",
    description: "Grayscale image of a handwritten digit.",
    details: "Standard MNIST input format."
  },
  {
    name: "Conv Layer 1",
    type: 'conv',
    shape: "26x26x16",
    description: "Extracts low-level features like edges.",
    details: "16 filters, 3x3 kernel, ReLU activation."
  },
  {
    name: "Max Pooling 1",
    type: 'pool',
    shape: "13x13x16",
    description: "Reduces spatial dimensions, providing translation invariance.",
    details: "2x2 pool size, stride 2."
  },
  {
    name: "Conv Layer 2",
    type: 'conv',
    shape: "11x11x32",
    description: "Extracts high-level patterns like curves and loops.",
    details: "32 filters, 3x3 kernel, ReLU activation."
  },
  {
    name: "Max Pooling 2",
    type: 'pool',
    shape: "5x5x32",
    description: "Further downsampling.",
    details: "2x2 pool size, stride 2."
  },
  {
    name: "Flatten",
    type: 'flatten',
    shape: "800",
    description: "Converts 3D feature maps to a 1D vector.",
    details: "Prepares data for fully connected layers."
  },
  {
    name: "Dense Layer",
    type: 'dense',
    shape: "128",
    description: "Learns complex combinations of features.",
    details: "ReLU activation, Dropout (0.5) for regularization."
  },
  {
    name: "Output Layer",
    type: 'dense',
    shape: "10",
    description: "Probability distribution over digits 0-9.",
    details: "Softmax activation."
  }
];

export const COMPARISON_DATA = [
  { metric: "Accuracy", mlp: 92.5, cnn: 99.2 },
  { metric: "Parameters", mlp: 101000, cnn: 45000 },
  { metric: "Training Time (s)", mlp: 12, cnn: 45 },
  { metric: "Robustness", mlp: 40, cnn: 95 },
];

export const OPTIMIZATION_STRATEGIES = [
  {
    title: "Dropout",
    description: "Randomly deactivates neurons during training to prevent co-adaptation and overfitting.",
    impact: "Reduces the gap between training and validation accuracy."
  },
  {
    title: "Batch Normalization",
    description: "Normalizes the inputs to each layer to maintain stable distributions of activations.",
    impact: "Accelerates training and allows for higher learning rates."
  }
];
