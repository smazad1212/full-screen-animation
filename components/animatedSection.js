'use client';

import { useEffect } from 'react';
import styles from '@/app/page.module.css';

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

const AnimatedSection = () => {
  useEffect(() => {
    const container = document.querySelector(`.${styles.container}`);
    const section = document.querySelector(`.${styles.section}`);
    const title = document.querySelector(`.${styles.title}`);
    const paragraph = document.querySelector(`.${styles.paragraph}`);
    const extra = document.querySelector(`.${styles.extra}`);
    let previousScrollY = window.scrollY;
    let titleViewed = false;
    let paragraphViewed = false;
    let animationInProgress = false;
    let scrollTimeout;

    const waitForAnimationComplete = () => {
      animationInProgress = true;
      //revert animationInProgress to false after 800ms for transition time
      setTimeout(() => {
        console.log("animation completed");
        animationInProgress = false;
      }, 800);
    }

    const handleScroll = (event) => {
      event.preventDefault();
      if (!animationInProgress) {
        console.log("animation not in progress");
        window.scrollTo(0, window.scrollY + event.deltaY * 1);
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > previousScrollY) {
        // console.log('Scrolling down');
        let isContainerInView = extra.getBoundingClientRect().top < container.getBoundingClientRect().bottom
        console.log("isContainerInView: ", isContainerInView);
        if (!titleViewed && isContainerInView) {
          title.classList.add(styles.titleShown);
          titleViewed = true;
          waitForAnimationComplete()
          return;
        }
        if (animationInProgress) {
          console.log("slowed down scrolling");
          window.scrollTo(0, window.scrollY + event.deltaY * 0.01);
        }
        if (titleViewed && !paragraphViewed && !animationInProgress && isContainerInView) {
          paragraph.classList.add(styles.paragraphShown);
          paragraphViewed = true;
          waitForAnimationComplete()
          return;
        }
      } else {
        // console.log('Scrolling up');
      }
      previousScrollY = currentScrollY;
    };

    const slowScroll = (event) => {
      if (animationInProgress) {
      // if (window.scrollY > 0) {
        event.preventDefault();
        window.scrollTo(0, window.scrollY + event.deltaY * 0.01);
        console.log("time to slow down")
        // clearTimeout(scrollTimeout);
        // scrollTimeout = setTimeout(() => {
        //   console.log("slowed down: ", window.scrollY);
        //   window.scrollTo(0, window.scrollY + event.deltaY * 0.01);
        // }, 1);
      }
    };

    // window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', throttle(handleScroll, 5), { passive: false });
    // window.addEventListener('wheel', slowScroll, { passive: false });

    return () => {
      // window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      // window.removeEventListener('wheel', slowScroll);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Engineered for testing, debugging, and development.
        </h1>
        <p className={styles.paragraph}>
          This is some additional text that will appear as you scroll down.
        </p>
      </div>
      <div className={styles.extra}></div>
    </section>
  );
};

export default AnimatedSection;