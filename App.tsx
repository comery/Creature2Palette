

import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { analyzeCreatureImage, fileToBase64 } from './services/geminiService';
import type { AnalysisResult } from './types';
import { Modal } from './components/Modal';
import { HowToUseContent } from './components/info/HowToUseContent';
import { UpdatesContent } from './components/info/UpdatesContent';
import { DownloadsContent } from './components/info/DownloadsContent';
import { CreditsContent } from './components/info/CreditsContent';
import { PixelatedImage } from './components/PixelatedImage';
import { ExtractedPaletteDisplay } from './components/ExtractedPaletteDisplay';
import { CustomDropdown } from './components/CustomDropdown';

type ModalType = 'howto' | 'updates' | 'downloads' | 'credits';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [colorCount, setColorCount] = useState<number>(7);
  const [fullResult, setFullResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);


  const handleImageChange = (file: File | null) => {
    if (file && file !== imageFile) {
        setFullResult(null);
        setError(null);
    }
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setFullResult(null);
    setError(null);

    try {
      const { base64Data, mimeType } = await fileToBase64(imageFile);
      const analysisResult = await analyzeCreatureImage(base64Data, mimeType);
      setFullResult(analysisResult);
    // FIX: Added missing opening brace for the catch block.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [imageFile]);

  const displayedResult = useMemo(() => {
    if (!fullResult) return null;
    return {
        ...fullResult,
        colors: fullResult.colors.slice(0, colorCount)
    };
  }, [fullResult, colorCount]);

  const renderModalContent = () => {
    switch(activeModal) {
      case 'howto': return <HowToUseContent />;
      case 'updates': return <UpdatesContent />;
      case 'downloads': return <DownloadsContent colors={displayedResult?.colors || []} creatureName={displayedResult?.creatureName || 'palette'} />;
      case 'credits': return <CreditsContent />;
      default: return null;
    }
  };
  
  const getModalTitle = () => {
     switch(activeModal) {
      case 'howto': return "How to Use: Creature Palette";
      case 'updates': return "Version History";
      case 'downloads': return "Export Palette";
      case 'credits': return "Credits & Acknowledgements";
      default: return "";
    }
  }

  return (
    <>
      <Header onMenuClick={(modal) => setActiveModal(modal as ModalType)} />
      
      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>

      <div className="flex flex-1 overflow-hidden bg-slate-200 relative min-h-0">
        {/* Left Sidebar - Controls */}
        <aside className="w-80 bg-[#f5f5f5] border-r border-gray-300 flex flex-col overflow-y-auto shadow-xl z-10 flex-shrink-0">
            
            <div className="p-4 border-b border-gray-300">
                <div className="flex items-center justify-between mb-2">
                     <h3 className="font-bold text-gray-700 text-sm">Number of data classes:</h3>
                     <div className="flex items-center gap-2">
                        <CustomDropdown 
                           options={[3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                           value={colorCount}
                           onChange={setColorCount}
                        />
                        <div className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-500 cursor-help" title="Select the number of dominant colors to extract from the image.">i</div>
                     </div>
                </div>
               
                <p className="text-xs text-gray-400 mt-2">
                    {fullResult ? "Adjusts display instantly." : "Select max colors to extract."}
                </p>
            </div>

            <div className="p-4 border-b border-gray-300">
                <div className="flex items-center justify-between mb-2">
                     <h3 className="font-bold text-gray-700 text-sm">Nature of your data:</h3>
                     <div className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-500 cursor-help" title="The AI will identify the creature's species and generate a summary based on web knowledge.">i</div>
                </div>
                <ImageUploader onImageChange={handleImageChange} previewUrl={previewUrl} />
                
                <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">Context</h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" defaultChecked disabled className="text-orange-500 rounded focus:ring-orange-500" />
                        <span className="text-sm text-gray-600">Identify Creature</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" defaultChecked disabled className="text-orange-500 rounded focus:ring-orange-500" />
                        <span className="text-sm text-gray-600">Web Search Summary</span>
                    </label>
                </div>
            </div>

            <div className="p-4 flex-1 bg-white">
                 <h3 className="font-bold text-gray-700 text-sm mb-3">Pick a color scheme:</h3>
                 <p className="text-xs text-gray-500 mb-4">
                    Upload an image and click analyze. The AI will identify the species and build a palette.
                 </p>

                 <button
                    onClick={handleAnalyze}
                    disabled={!imageFile || loading}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold py-3 px-4 rounded shadow hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Processing...
                        </>
                    ) : (
                        'Analyze Image'
                    )}
                  </button>

                  {loading && <div className="mt-6"><Loader /></div>}
                  
                  {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                          {error}
                      </div>
                  )}
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#e5e7eb] relative overflow-auto p-4 sm:p-8">
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {previewUrl ? (
                <div className="w-full flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                        <div className="relative shadow-xl bg-white px-1 py-2 border-[0.5px] border-gray-300 rounded-sm max-w-[360px] w-full h-[50vh] flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-hidden flex items-center justify-center">
                              <img 
                                src={previewUrl} 
                                alt="Analyzed Creature" 
                                className="max-w-full max-h-full object-contain block" 
                              />
                            </div>
                            <div className="bg-gray-50 border-t-[0.5px] border-gray-200 px-1 py-2 text-center text-xs text-gray-500">
                                Original Source Image
                            </div>
                        </div>

                        {displayedResult && (
                          <div className="z-10 animate-fade-in min-w-0 h-[50vh] flex-1">
                            <ResultDisplay creatureName={displayedResult.creatureName} description={displayedResult.description} />
                          </div>
                        )}
                    </div>

                    {displayedResult && (
                      <div className="flex items-start gap-4">
                        <div className="max-w-[360px] w-full h-[50vh]">
                          <PixelatedImage imageUrl={previewUrl} />
                        </div>
                        <div className="w-[280px]">
                          <ExtractedPaletteDisplay colors={displayedResult.colors} />
                        </div>
                      </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-400 max-w-md m-auto z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-500 mb-2">No Image Loaded</h2>
                    <p>Use the sidebar to upload a creature image.</p>
                </div>
            )}

            <div className="fixed bottom-2 right-4 text-gray-500 text-xs z-50">
                © Creature Palette, Powered by Chentao Yang
            </div>
        </main>
      </div>
    </>
  );
};

export default App;
