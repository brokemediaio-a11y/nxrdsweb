import React from 'react';
import './ParticleBeam.css';

const ParticleBeam = () => {
  return (
    <div className="particle-beam-container">
      {/* Phase 1: Initial Formation Beam (plays once) */}
      <div className="beam-formation">
        <div className="beam-core-formation"></div>
        <div className="beam-glow-formation"></div>
      </div>

      {/* Phase 2: Continuous Falling Beam (loops) */}
      <div className="beam-falling">
        <div className="beam-core-falling"></div>
        <div className="beam-glow-falling"></div>
      </div>

      {/* Bottom Glow Effect (starts after Phase 1, loops continuously) */}
      <div className="beam-bottom-glow">
        <div className="glow-layer-1"></div>
        <div className="glow-layer-2"></div>
        <div className="glow-layer-3"></div>
      </div>
    </div>
  );
};

export default ParticleBeam;

