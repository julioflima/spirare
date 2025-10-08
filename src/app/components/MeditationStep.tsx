import { MeditationStep } from '@/types/meditation';

interface MeditationStepProps {
  step: MeditationStep;
  stepNumber: number;
}

export default function MeditationStepComponent({ step, stepNumber }: MeditationStepProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-md border border-blue-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
          {stepNumber}
        </span>
        {step.nome}
      </h3>
      <div className="space-y-3">
        {step.subetapas.map((subetapa, index) => (
          <div 
            key={index} 
            className="bg-white bg-opacity-60 rounded-lg p-4 border-l-4 border-gradient-to-b from-blue-400 to-purple-400"
          >
            <p className="text-gray-700 leading-relaxed font-medium">
              {subetapa}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}