import * as React from 'react';
import { useSpring } from 'react-spring/three';
import { PIPE_CONSTANTS } from '../../utils/Contants';
import DataContext from '../../store/DataProvider';

function generateRandomNumbersInRange(min, max, count) {
  const randomNumbers = [];
  for (let i = 0; i < count; i++) {
    const randomNumber = Math.random() * (max - min) + min;
    randomNumbers.push(randomNumber);
  }

  //console.log('random...', randomNumbers)
  return randomNumbers;
  }

function generateScaledNumbers(rangeStart, rangeEnd, scale) {
    const numbers = [];
    for (let i = rangeStart; i <= rangeEnd; i += scale) {
      numbers.push(i);
    }

    return numbers;
}

function gridLayout(data) {
  const numPoints = data?.length;
  const numCols = Math.ceil(Math.sqrt(numPoints));
  const numRows = numCols;

  // Extract pipeSectionId values as numbers
  const pipeSectionIds = data.map(item => parseInt(item.pipeSectionId));

  // Find minimum and maximum values
  const minValue = Math.min(...pipeSectionIds);
  const maxValue = Math.max(...pipeSectionIds);

  //console.log('pipeSectionIDs..', pipeSectionIds, "min: ", minValue, "max: ", maxValue)

  const randomNumbers = generateRandomNumbersInRange(-PIPE_CONSTANTS.pipeInnerRadius, PIPE_CONSTANTS.pipeInnerRadius, pipeSectionIds?.length);
  //const scaledNumbers = generateScaledNumbers(minValue, maxValue, PIPE_CONSTANTS.pipeSectionScaleFactor);

  if(data) {
    for (let i = 0; i < numPoints; ++i) {
      const datum = data[i];
      const col = (i % numCols) - numCols / 2;
      const row = Math.floor(i / numCols) - numRows / 2;

      datum.x = (parseInt(data[i].pipeSectionId) - minValue) / PIPE_CONSTANTS.pipeSectionScaleFactor
      //datum.x = scaledNumbers[i + 1];
      //datum.y = randomNumbers[i];
      datum.y = 0;
      //datum.x = (col * 1.05);
      //datum.y = row * 1.05;
      datum.z = PIPE_CONSTANTS.pipeOuterRadius;

      //console.log('co ordinates (x,y,z): ', datum.x, datum.y, datum.z)
    }
  }
}

export const useLayout = ({ data, layout = 'grid' }) => {
  React.useEffect(() => {
    switch (layout) {
      case 'grid':
      default: {
        gridLayout(data);
      }
    }
  }, [data, layout]);
};

function useSourceTargetLayout({ data, layout }) {
  // prep for new animation by storing source
  React.useEffect(() => {
    if(data) {
      for (let i = 0; i < data?.length; ++i) {
        data[i].sourceX = data[i].x || 0;
        data[i].sourceY = data[i].y || 0;
        data[i].sourceZ = data[i].z || 0;
      }
    }
  }, [data, layout]);

  // run layout
  useLayout({ data, layout });

  // store target
  React.useEffect(() => {
    if(data) {
      for (let i = 0; i < data?.length; ++i) {
        data[i].targetX = data[i].x;
        data[i].targetY = data[i].y;
        data[i].targetZ = data[i].z;
      }
    } 
  }, [data, layout]);
}

function interpolateSourceTarget(data, progress) {
  if(data) {
    for (let i = 0; i < data?.length; ++i) {
      data[i].x = (1 - progress) * data[i].sourceX + progress * data[i].targetX;
      data[i].y = (1 - progress) * data[i].sourceY + progress * data[i].targetY;
      data[i].z = (1 - progress) * data[i].sourceZ + progress * data[i].targetZ;
    }
  }
}

export function useAnimatedLayout({ data, layout, onFrame }) {
  // compute layout remembering initial position as source and
  // end position as target
  useSourceTargetLayout({ data, layout });

  // do the actual animation when layout changes
  const prevLayout = React.useRef(layout);
  useSpring({
    animationProgress: 1,
    from: { animationProgress: 0 },
    reset: layout !== prevLayout.current,
    onFrame: ({ animationProgress }) => {
      // interpolate based on progress
      interpolateSourceTarget(data, animationProgress);
      // callback to indicate data has updated
      onFrame({ animationProgress });
    },
  });
  prevLayout.current = layout;
}
