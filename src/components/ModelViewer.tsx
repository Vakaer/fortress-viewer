import { useEffect, useRef } from 'react';
import '@google/model-viewer';
import type { Annotation } from '../types/annotation';
import type { ModelViewerElement } from '@google/model-viewer';
import './ModelViewer.css'
import calculateOrbit from '../utils/calculate-orbit';

interface HeartModelViewerProps {
  annotations: Annotation[];
}

export const ModelViewer = ({ annotations }: HeartModelViewerProps) => {
  const modelViewerRef = useRef<ModelViewerElement>(null);

  useEffect(() => {
    if(!modelViewerRef.current) return

    const modelViewer = modelViewerRef.current;
    const annotationClicked = (annotation: HTMLElement) => {
      const dataset = annotation.dataset;
      modelViewer.cameraTarget = dataset.target || '';
      modelViewer.cameraOrbit = dataset.orbit || '';
      modelViewer.fieldOfView = '45deg';
    }

    modelViewer.querySelectorAll('button').forEach((hotspot) => {
      hotspot.addEventListener('click', () => annotationClicked(hotspot));
    });
  }, [])

  return (
    <div className="model-viewer-container">
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
        min-field-of-view="20deg"
        max-field-of-view="45deg"
        interpolation-decay="200"
        min-camera-orbit="auto auto 30%"
        tone-mapping="aces"
        ar
      >
        {annotations.map((hotspot, index) => {
          const orbit = calculateOrbit(hotspot.normal);
          const target = hotspot.position; // Target is simply the position

          return (
            <button
              key={index}
              className="view-button"
              slot={hotspot.slot}
              data-position={hotspot.position}
              data-normal={hotspot.normal}
              data-orbit={orbit}  // Added orbit data
              data-target={target} // Added target data
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
