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

  useEffect(() => {
    if(!modelViewerRef.current) return

    const modelViewer = modelViewerRef.current;

    const annotationClicked = (annotation: HTMLElement) => {
      const dataset = annotation.dataset;
      modelViewer.cameraTarget = dataset.target || '';
      modelViewer.cameraOrbit = dataset.orbit || '';
      modelViewer.fieldOfView = '45deg';
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

    modelViewer.querySelectorAll('button').forEach((hotspot) => {
      hotspot.addEventListener('click', () => annotationClicked(hotspot));
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
              <div className="HotspotAnnotation">{hotspot.label}</div>
            </button>
          )
        })}
      </model-viewer>
    </div>
  );
};
