'use client';

import { useState } from 'react';
import type { AssessmentQuestion, AssessmentResult } from '@/lib/resources-db';

interface AssessmentRendererProps {
  questions: AssessmentQuestion[];
  results: AssessmentResult[];
}

export function AssessmentRenderer({ questions, results }: AssessmentRendererProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  const hasCategories = questions.some((q) => q.category);
  const questionsByCategory = hasCategories
    ? sortedQuestions.reduce<Record<string, AssessmentQuestion[]>>((acc, q) => {
        const category = q.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(q);
        return acc;
      }, {})
    : { All: sortedQuestions };

  const categories = Object.keys(questionsByCategory);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const allAnswered = answeredCount === totalCount;

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const matchingResult = results.find(
    (r) => totalScore >= r.minScore && totalScore <= r.maxScore
  );

  const handleSubmit = () => {
    if (allAnswered) setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  if (showResults && matchingResult) {
    return (
      <div className="space-y-8">
        {/* Score Display */}
        <div className="glass rounded-xl p-8 text-center border border-atomic-tangerine/20">
          <div className="text-5xl font-bold text-atomic-tangerine mb-2">
            {totalScore}
          </div>
          <div className="text-greige">out of {totalCount * 10} possible points</div>
        </div>

        {/* Result */}
        <div className="glass rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {matchingResult.title}
          </h2>
          <p className="text-shroomy leading-relaxed mb-6">
            {matchingResult.description}
          </p>

          {matchingResult.recommendations.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-3">Recommended Next Steps:</h3>
              <ul className="space-y-2">
                {matchingResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 text-shroomy">
                    <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-atomic-tangerine/20 text-atomic-tangerine rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-atomic-tangerine text-white rounded-lg font-medium hover:bg-hot-sauce transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="glass rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-white">Progress</span>
          <span className="text-sm text-greige">
            {answeredCount} of {totalCount} questions answered
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="bg-atomic-tangerine h-3 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            {hasCategories && (
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
                {category}
              </h3>
            )}
            <div className="space-y-6">
              {questionsByCategory[category].map((question) => {
                const globalIndex = sortedQuestions.findIndex((q) => q.id === question.id);
                return (
                  <div key={question.id} className="glass rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-atomic-tangerine/10 text-atomic-tangerine rounded-full font-medium">
                        {globalIndex + 1}
                      </span>
                      <h4 className="font-medium text-white">{question.question}</h4>
                    </div>
                    <div className="space-y-2 ml-12">
                      {question.options.map((option) => {
                        const isSelected = answers[question.id] === option.value;
                        return (
                          <label
                            key={option.value}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-atomic-tangerine/10 border-atomic-tangerine/50'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={isSelected}
                              onChange={() => handleAnswer(question.id, option.value)}
                              className="w-4 h-4 text-atomic-tangerine focus:ring-atomic-tangerine cursor-pointer"
                            />
                            <span className={isSelected ? 'text-white' : 'text-shroomy'}>
                              {option.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`px-6 py-3 bg-atomic-tangerine text-white rounded-lg font-medium transition-colors ${
            !allAnswered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hot-sauce'
          }`}
        >
          {allAnswered
            ? 'See My Results'
            : `Answer ${totalCount - answeredCount} more question${totalCount - answeredCount > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}
