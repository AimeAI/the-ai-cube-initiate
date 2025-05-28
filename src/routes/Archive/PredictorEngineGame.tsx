import React, { useEffect, useRef, useState } from 'react';
import './PredictorEngineGame.css';

const PredictorEngineGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataStreamRef = useRef<HTMLDivElement>(null);
  const predictionSliderRef = useRef<HTMLDivElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const confirmPredictionBtnRef = useRef<HTMLButtonElement>(null);
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const scoreValueRef = useRef<HTMLDivElement>(null);
  const accuracyTextRef = useRef<HTMLDivElement>(null);
  const accuracyFillRef = useRef<HTMLDivElement>(null);
  const mysticalVoiceRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const patternHintRef = useRef<SVGSVGElement>(null);

  const gameInstanceRef = useRef<any>(null); // To hold the game logic instance

  useEffect(() => {
    // Ensure all refs are current before initializing the game
    if (
      !canvasRef.current ||
      !dataStreamRef.current ||
      !predictionSliderRef.current ||
      !sliderHandleRef.current ||
      !sliderTrackRef.current ||
      !confirmPredictionBtnRef.current ||
      !loadingScreenRef.current ||
      !gameContainerRef.current ||
      !scoreValueRef.current ||
      !accuracyTextRef.current ||
      !accuracyFillRef.current ||
      !mysticalVoiceRef.current ||
      !particlesRef.current ||
      !patternHintRef.current
    ) {
      return; // Wait for all refs to be available
    }

    class PredictorEngine {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      dataStream: HTMLDivElement;
      scoreValue: HTMLDivElement;
      accuracyText: HTMLDivElement;
      accuracyFill: HTMLDivElement;
      mysticalVoice: HTMLDivElement;
      particlesContainer: HTMLDivElement;
      patternHint: SVGSVGElement;
      predictionSlider: HTMLDivElement;
      sliderHandle: HTMLDivElement;
      sliderTrack: HTMLDivElement;
      confirmPredictionBtn: HTMLButtonElement;
      loadingScreen: HTMLDivElement;
      gameContainer: HTMLDivElement;


      score: number;
      accuracy: number;
      currentPattern: string | null;
      dataPoints: { x: number; y: number }[];
      // predictions: any[]; // Not used in the provided code
      level: number;
      patterns: string[];
      isDragging: boolean;
      sliderValue: number;

      constructor(
        canvasEl: HTMLCanvasElement,
        dataStreamEl: HTMLDivElement,
        scoreValueEl: HTMLDivElement,
        accuracyTextEl: HTMLDivElement,
        accuracyFillEl: HTMLDivElement,
        mysticalVoiceEl: HTMLDivElement,
        particlesEl: HTMLDivElement,
        patternHintEl: SVGSVGElement,
        predictionSliderEl: HTMLDivElement,
        sliderHandleEl: HTMLDivElement,
        sliderTrackEl: HTMLDivElement,
        confirmBtnEl: HTMLButtonElement,
        loadingScreenEl: HTMLDivElement,
        gameContainerEl: HTMLDivElement
      ) {
        this.canvas = canvasEl;
        this.ctx = this.canvas.getContext('2d')!;
        this.dataStream = dataStreamEl;
        this.scoreValue = scoreValueEl;
        this.accuracyText = accuracyTextEl;
        this.accuracyFill = accuracyFillEl;
        this.mysticalVoice = mysticalVoiceEl;
        this.particlesContainer = particlesEl;
        this.patternHint = patternHintEl;
        this.predictionSlider = predictionSliderEl;
        this.sliderHandle = sliderHandleEl;
        this.sliderTrack = sliderTrackEl;
        this.confirmPredictionBtn = confirmBtnEl;
        this.loadingScreen = loadingScreenEl;
        this.gameContainer = gameContainerEl;

        this.score = 0;
        this.accuracy = 0;
        this.currentPattern = null;
        this.dataPoints = [];
        this.level = 1;
        this.patterns = [
          'linear',
          'exponential',
          'sine',
          'logarithmic',
          'polynomial',
        ];
        this.isDragging = false;
        this.sliderValue = 0.5; // Initial slider value

        this.init();
      }

      init() {
        this.setupCanvas();
        this.createParticles();
        this.setupControls();

        setTimeout(() => {
          if (this.loadingScreen) this.loadingScreen.style.opacity = '0';
          setTimeout(() => {
            if (this.loadingScreen) this.loadingScreen.style.display = 'none';
            if (this.gameContainer) this.gameContainer.style.display = 'block';
            this.startNewRound();
            this.animate();
            this.showVoiceMessage(
              'Welcome, young Predictor. Observe the cosmic patterns and forecast their future...'
            );
          }, 1000);
        }, 2000);
      }

      setupCanvas() {
        this.canvas.width = this.gameContainer.clientWidth; // Use game container dimensions
        this.canvas.height = this.gameContainer.clientHeight;

        const resizeObserver = new ResizeObserver(() => {
            if (this.gameContainer && this.canvas) {
                 this.canvas.width = this.gameContainer.clientWidth;
                 this.canvas.height = this.gameContainer.clientHeight;
            }
        });
        if (this.gameContainer) {
            resizeObserver.observe(this.gameContainer);
        }
        // Cleanup resize observer on component unmount
        return () => resizeObserver.disconnect();
      }

      createParticles() {
        this.particlesContainer.innerHTML = ''; // Clear existing particles
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 6 + 's';
          this.particlesContainer.appendChild(particle);
        }
      }

      updateSlider = (clientX: number) => {
        const rect = this.predictionSlider.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        this.sliderValue = percentage;

        this.sliderHandle.style.left = `${percentage * (rect.width - this.sliderHandle.offsetWidth) / rect.width * 100}%`; // Adjust for handle width
        this.sliderTrack.style.width = `${percentage * 100}%`;
      };
      
      mouseDownHandler = (e: MouseEvent) => {
        this.isDragging = true;
        this.updateSlider(e.clientX);
      };
      mouseMoveHandler = (e: MouseEvent) => {
        if (this.isDragging) {
          this.updateSlider(e.clientX);
        }
      };
      mouseUpHandler = () => {
        this.isDragging = false;
      };

      touchStartHandler = (e: TouchEvent) => {
        this.isDragging = true;
        this.updateSlider(e.touches[0].clientX);
      };
      touchMoveHandler = (e: TouchEvent) => {
        if (this.isDragging) {
          this.updateSlider(e.touches[0].clientX);
        }
      };
      touchEndHandler = () => {
        this.isDragging = false;
      };


      setupControls() {
        this.predictionSlider.addEventListener('mousedown', this.mouseDownHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        this.predictionSlider.addEventListener('touchstart', this.touchStartHandler, { passive: false });
        document.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
        document.addEventListener('touchend', this.touchEndHandler);

        this.confirmPredictionBtn.addEventListener('click', () => {
          this.makePrediction(this.sliderValue);
        });
      }

      startNewRound() {
        this.dataPoints = [];
        this.currentPattern =
          this.patterns[Math.floor(Math.random() * this.patterns.length)];
        this.generateDataPoints();
        this.displayDataPoints();
      }

      generateDataPoints() {
        const numPoints = 10;
        
        for (let i = 0; i < numPoints; i++) {
          const x = (i / (numPoints - 1)) * 0.7; // Show 70% of the pattern
          let y;

          switch (this.currentPattern) {
            case 'linear':
              y = 0.3 + x * 0.4;
              break;
            case 'exponential':
              y = 0.2 + Math.exp(x * 2) * 0.1;
              break;
            case 'sine':
              y = 0.5 + Math.sin(x * Math.PI * 2) * 0.3;
              break;
            case 'logarithmic':
              y = 0.3 + Math.log(x + 0.1) * 0.3;
              break;
            case 'polynomial':
              y = 0.5 + (x - 0.35) * (x - 0.35) * 2;
              break;
            default:
              y = 0.5;
          }

          y += (Math.random() - 0.5) * 0.05; // Add some noise
          y = Math.max(0.1, Math.min(0.9, y));

          this.dataPoints.push({ x, y });
        }
      }

      displayDataPoints() {
        // Clear existing points
        while (this.dataStream.firstChild) {
          this.dataStream.removeChild(this.dataStream.firstChild);
        }
        
        const streamRect = this.dataStream.getBoundingClientRect();

        this.dataPoints.forEach((point, index) => {
          const dot = document.createElement('div');
          dot.className = 'data-point';
          dot.style.left = `${point.x * streamRect.width}px`;
          dot.style.bottom = `${point.y * streamRect.height}px`;
          // dot.style.animationDelay = `${index * 0.1}s`; // Animation might be complex to replicate without CSS-in-JS or styled-components for dynamic delays

          setTimeout(() => {
            if (this.dataStream) this.dataStream.appendChild(dot);
          }, index * 100);
        });

        this.drawPatternHint();
      }

      drawPatternHint() {
        if (!this.patternHint || this.dataPoints.length === 0) return;
        const streamRect = this.dataStream.getBoundingClientRect();
        this.patternHint.innerHTML = '';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M ${this.dataPoints[0].x * streamRect.width} ${streamRect.height - this.dataPoints[0].y * streamRect.height}`;

        for (let i = 1; i < this.dataPoints.length; i++) {
          const prevPoint = this.dataPoints[i - 1];
          const currPoint = this.dataPoints[i];
          const cpX = ((prevPoint.x + currPoint.x) / 2) * streamRect.width;
          const cpY1 = streamRect.height - prevPoint.y * streamRect.height;
          // For a smoother curve, use the current point's Y for the control point's Y, or average
          const cpAvgY = (streamRect.height - prevPoint.y * streamRect.height + streamRect.height - currPoint.y * streamRect.height) / 2;
          d += ` Q ${cpX} ${cpAvgY} ${currPoint.x * streamRect.width} ${streamRect.height - currPoint.y * streamRect.height}`;
        }

        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'rgba(139, 95, 255, 0.3)');
        path.setAttribute('stroke-width', '2');
        this.patternHint.appendChild(path);
      }

      makePrediction(predictedSliderValue: number) {
        if (this.dataPoints.length === 0) return;
        const streamRect = this.dataStream.getBoundingClientRect();
        const lastPoint = this.dataPoints[this.dataPoints.length - 1];
        const nextX = lastPoint.x + (1 - 0.7) / (10 -1) ; // Predict the next point in the sequence

        let actualY;
        switch (this.currentPattern) {
          case 'linear':
            actualY = 0.3 + nextX * 0.4;
            break;
          case 'exponential':
            actualY = 0.2 + Math.exp(nextX * 2) * 0.1;
            break;
          case 'sine':
            actualY = 0.5 + Math.sin(nextX * Math.PI * 2) * 0.3;
            break;
          case 'logarithmic':
            actualY = 0.3 + Math.log(nextX + 0.1) * 0.3;
            break;
          case 'polynomial':
            actualY = 0.5 + (nextX - 0.35) * (nextX - 0.35) * 2;
            break;
          default:
            actualY = 0.5;
        }
        actualY = Math.max(0.1, Math.min(0.9, actualY));

        const predictionDot = document.createElement('div');
        predictionDot.className = 'data-point';
        predictionDot.style.left = `${nextX * streamRect.width}px`;
        predictionDot.style.bottom = `${predictedSliderValue * streamRect.height}px`;
        predictionDot.style.background = 'var(--axis-x)';
        predictionDot.style.boxShadow = '0 0 20px var(--axis-x)';
        this.dataStream.appendChild(predictionDot);

        const error = Math.abs(actualY - predictedSliderValue);
        const currentAccuracy = Math.max(0, 100 - error * 200); // Max error of 0.5 leads to 0 accuracy
        this.updateAccuracyDisplay(currentAccuracy);

        setTimeout(() => {
          const actualDot = document.createElement('div');
          actualDot.className = 'data-point';
          actualDot.style.left = `${nextX * streamRect.width}px`;
          actualDot.style.bottom = `${actualY * streamRect.height}px`;
          this.dataStream.appendChild(actualDot);

          if (currentAccuracy > 80) {
            this.showVoiceMessage('Excellent prediction! Your cosmic insight grows stronger.');
            this.level++;
          } else if (currentAccuracy > 60) {
            this.showVoiceMessage('Good attempt. Continue observing the patterns of the universe.');
          } else {
            this.showVoiceMessage('The patterns elude you. Focus your consciousness and try again.');
          }

          setTimeout(() => {
            predictionDot.remove();
            actualDot.remove();
            this.startNewRound();
          }, 3000);
        }, 1000);
      }

      updateAccuracyDisplay(currentAccuracy: number) {
        this.accuracy = Math.round(currentAccuracy);
        this.scoreValue.textContent = `${this.accuracy}%`;
        this.accuracyText.textContent = `${this.accuracy}%`;

        const rotation = -135 + (this.accuracy / 100) * 270;
        this.accuracyFill.style.transform = `rotate(${rotation}deg)`;
      }

      showVoiceMessage(message: string) {
        this.mysticalVoice.textContent = message;
        this.mysticalVoice.style.opacity = '1';

        setTimeout(() => {
          this.mysticalVoice.style.opacity = '0';
        }, 4000);
      }

      animationFrameId: number | null = null;
      animate = () => {
        if (!this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgroundEffects();
        this.animationFrameId = requestAnimationFrame(this.animate);
      };

      drawBackgroundEffects() {
        if (!this.canvas || !this.ctx) return;
        const time = Date.now() * 0.0005; // Slowed down for less frantic visuals

        this.ctx.save();
        this.ctx.globalAlpha = 0.05; // More subtle
        this.ctx.strokeStyle = 'rgba(139, 95, 255, 0.3)';
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < 3; i++) { // Fewer elements
          const x = this.canvas.width * 0.5 + Math.cos(time * 0.15 + i * 2) * (this.canvas.width * 0.2);
          const y = this.canvas.height * 0.5 + Math.sin(time * 0.1 + i * 2) * (this.canvas.height * 0.2);
          const size = (this.canvas.width * 0.05) + Math.sin(time * 0.5 + i) * (this.canvas.width * 0.02);

          this.ctx.beginPath();
          for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2 + time * 0.05 * (i % 2 === 0 ? 1 : -1); // Slow rotation
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (j === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
          }
          this.ctx.closePath();
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        // Remove event listeners
        if (this.predictionSlider) {
            this.predictionSlider.removeEventListener('mousedown', this.mouseDownHandler);
            this.predictionSlider.removeEventListener('touchstart', this.touchStartHandler);
        }
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        document.removeEventListener('touchmove', this.touchMoveHandler);
        document.removeEventListener('touchend', this.touchEndHandler);
        
        // Clear any timeouts that might be running
        // This is tricky without storing all timeout IDs. For simplicity, this is omitted.
        // In a more robust solution, timeout IDs would be stored and cleared.
      }
    }

    gameInstanceRef.current = new PredictorEngine(
      canvasRef.current!,
      dataStreamRef.current!,
      scoreValueRef.current!,
      accuracyTextRef.current!,
      accuracyFillRef.current!,
      mysticalVoiceRef.current!,
      particlesRef.current!,
      patternHintRef.current!,
      predictionSliderRef.current!,
      sliderHandleRef.current!,
      sliderTrackRef.current!,
      confirmPredictionBtnRef.current!,
      loadingScreenRef.current!,
      gameContainerRef.current!
    );
    
    // Cleanup function
    return () => {
      if (gameInstanceRef.current && typeof gameInstanceRef.current.destroy === 'function') {
        gameInstanceRef.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <div className="predictor-engine-body">
      <div id="loadingScreen" ref={loadingScreenRef}>
        <div className="loading-text">Initializing Predictor Engine</div>
      </div>

      <div id="gameContainer" ref={gameContainerRef}>
        <canvas id="mysticalCanvas" ref={canvasRef}></canvas>
        
        <div id="predictionInterface">
            <div className="sacred-header">
                <h1 className="simulation-title">Predictor Engine</h1>
                <p className="sacred-subtitle">Master the Art of Cosmic Prediction</p>
            </div>

            <div id="timeSeriesDisplay">
                <div className="data-stream" id="dataStream" ref={dataStreamRef}>
                    <svg className="pattern-hint" id="patternHint" ref={patternHintRef}></svg>
                </div>
                
                <div className="prediction-controls">
                    <div className="prediction-slider" id="predictionSlider" ref={predictionSliderRef}>
                        <div className="slider-track" id="sliderTrack" ref={sliderTrackRef}></div>
                        <div className="slider-handle" id="sliderHandle" ref={sliderHandleRef}></div>
                    </div>
                    <button className="sacred-button" id="confirmPrediction" ref={confirmPredictionBtnRef}>
                        Confirm Prediction
                    </button>
                </div>
            </div>

            <div id="scoreDisplay">
                <div className="score-label">Prediction Accuracy</div>
                <div className="score-value" id="scoreValue" ref={scoreValueRef}>0%</div>
            </div>

            <div className="accuracy-indicator">
                <div className="accuracy-ring">
                    <div className="accuracy-fill" id="accuracyFill" ref={accuracyFillRef}></div>
                    <div className="accuracy-text" id="accuracyText" ref={accuracyTextRef}>0%</div>
                </div>
            </div>

            <div id="mysticalVoice" ref={mysticalVoiceRef}></div>
        </div>

        <div className="particles" id="particles" ref={particlesRef}></div>
      </div>
    </div>
  );
};

export default PredictorEngineGame;