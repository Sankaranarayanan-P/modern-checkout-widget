
import { useEffect, useState } from "react";

export function useAnimationSequence(delay = 0, interval = 100, count = 1) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isVisible;
}

export function useAnimatedValue(startValue: number, endValue: number, duration = 1000) {
  const [value, setValue] = useState(startValue);
  
  useEffect(() => {
    const startTime = Date.now();
    
    const updateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed >= duration) {
        setValue(endValue);
        return;
      }
      
      const progress = elapsed / duration;
      const currentValue = startValue + (endValue - startValue) * progress;
      setValue(Math.round(currentValue * 100) / 100);
      
      requestAnimationFrame(updateValue);
    };
    
    const animationFrame = requestAnimationFrame(updateValue);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [startValue, endValue, duration]);
  
  return value;
}
