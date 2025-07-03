import React from 'react';
import ConfettiEffect from './ConfettiEffect.jsx';
import HeartsEffect from './HeartsEffect.jsx';
import SparklesEffect from './SparklesEffect.jsx';

const EffectsContainer = ({ confetti, hearts, sparkles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <ConfettiEffect confetti={confetti} />
      <HeartsEffect hearts={hearts} />
      <SparklesEffect sparkles={sparkles} />
    </div>
  );
};

export default EffectsContainer;