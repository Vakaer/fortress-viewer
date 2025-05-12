import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer';
import { useEffect, useRef, useState } from 'react';
import type { Annotation } from '../types/annotation';
import './ModelViewer.css';

interface HeartModelViewerProps {
  annotations: Annotation[];
}

export const ModelViewer = ({ annotations }: HeartModelViewerProps) => {
  const modelViewerRef = useRef<ModelViewerElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const resetCamera = () => {
    if (!modelViewerRef.current) return;
    const modelViewer = modelViewerRef.current;
    modelViewer.cameraTarget = '90m 500m 200m';
    modelViewer.cameraOrbit = '67.89deg 81deg 8552m';
    modelViewer.fieldOfView = '30deg';
  };

  useEffect(() => {
    if(!modelViewerRef.current) return

    const modelViewer = modelViewerRef.current;

    const annotationClicked = (annotation: HTMLElement) => {
      const dataset = annotation.dataset;
      modelViewer.cameraTarget = dataset.target || '';
      modelViewer.cameraOrbit = dataset.orbit || '';
      modelViewer.fieldOfView = '45deg';
      // Speak the hotspot label in Arabic and English, only once each
      const label = annotation.querySelector('#hotspot-label')?.textContent || '';
      if (label) {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        const voices = window.speechSynthesis.getVoices();
        // const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        const utterances: SpeechSynthesisUtterance[] = [];
        // if (arabicVoice) {
        //   const arUtter = new window.SpeechSynthesisUtterance(label);
        //   arUtter.voice = arabicVoice;
        //   utterances.push(arUtter);
        // }
        if (englishVoice) {
          const enUtter = new window.SpeechSynthesisUtterance(label);
          enUtter.voice = englishVoice;
          utterances.push(enUtter);
        }
        // Speak utterances in sequence
        function speakNext(index = 0) {
          if (index < utterances.length) {
            utterances[index].onend = () => speakNext(index + 1);
            window.speechSynthesis.speak(utterances[index]);
          }
        }
        speakNext();
      }
    }

    const handleProgress = (event: Event) => {
      const progress = (event as CustomEvent).detail.totalProgress;
      setLoadingProgress(Math.round(progress * 100));
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    modelViewer.addEventListener('progress', handleProgress);
    modelViewer.addEventListener('load', handleLoad);

    modelViewer.querySelectorAll('.view-button').forEach((hotspot) => {
      hotspot.addEventListener('click', (e) => {
        // Only trigger if the click wasn't on the close button
        if (!(e.target as HTMLElement).closest('.close-button')) {
          annotationClicked(hotspot as HTMLElement);
        }
      });
    });

    return () => {
      modelViewer.removeEventListener('progress', handleProgress);
      modelViewer.removeEventListener('load', handleLoad);
    };
  }, [])

  return (
    <div className="model-viewer-container" slot='progress-bar'>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text"> loading.. {loadingProgress}%</div>
          </div>
        </div>
      )}
      <model-viewer
        ref={modelViewerRef}
        src="/fortress.glb"
        camera-controls
        // auto-rotate
        shadow-intensity="1"
        ar-status="not-presenting"
        style={{
          minHeight: '90vh',
          width: '100vw'
        }}
        touch-action="none"
        camera-target="90m 500m 200m"
        camera-orbit="67.89deg 81deg 8552m"
        field-of-view="30deg"
        interpolation-decay="200"
        min-camera-orbit="auto auto 15%"
        tone-mapping="aces"
        ar
      >
        {annotations.map((hotspot, index) => {
          return (
            <button
              key={index}
              className="view-button"
              slot={hotspot.slot}
              data-position={hotspot.position}
              data-normal={hotspot.normal}
              data-orbit={hotspot.orbit}
              data-target={hotspot.position}
              data-visibility-attribute={hotspot.visibilityAttribute}
            >
              <div className="HotspotAnnotation">
                <span id='hotspot-label'>{hotspot.label}</span>
                <button
                  className="close-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetCamera();
                  }}
                >
                  ×
                </button>
              </div>
            </button>
          )
        })}
      </model-viewer>
    </div>
  );
};
