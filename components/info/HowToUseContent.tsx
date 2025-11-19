import React from 'react';

export const HowToUseContent: React.FC = () => {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <p>
        This tool is designed to be a powerful assistant for designers, artists, and nature lovers. It leverages AI to identify a creature from an image and generate a beautiful, harmonious color palette from it.
      </p>
      
      <h3 className="text-base font-bold text-gray-800 border-b pb-1 mt-6">Getting Started is Easy:</h3>
      
      <ol className="list-decimal list-inside space-y-3 pl-2">
        <li>
          <strong>Upload an Image:</strong> Click the "UPLOAD IMAGE" button or drag and drop a file into the designated area in the sidebar. For best results, use a clear, well-lit photo of a single creature.
        </li>
        <li>
          <strong>Select Data Classes:</strong> Choose the number of colors (from 3 to 12) you want in your final palette using the "Number of data classes" dropdown. You can change this at any time after analysis without re-uploading.
        </li>
        <li>
          <strong>Analyze:</strong> Click the "Analyze Image" button. The AI will process the image to identify the species, provide a summary, and extract the dominant colors.
        </li>
        <li>
          <strong>Export:</strong> Once the results are displayed, you can copy any color's value (HEX, RGB, or HSL) with a single click. Use the "Downloads" tab in the header to export the entire palette in various formats.
        </li>
      </ol>

      <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-md">
        <p className="font-bold text-orange-700">Tip:</p>
        <p className="text-orange-900">The colors are automatically sorted by their dominance in the image. The first color is the most prevalent, and so on. This helps in creating balanced and visually appealing designs.</p>
      </div>
    </div>
  );
};