'use client';

import { useEffect } from 'react';
import styles from '@/app/page.module.css';

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
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
    const animatedImage = document.querySelector(`.${styles.animatedImage}`);
    let previousScrollY = window.scrollY;
    let titleViewed = false;
    let paragraphViewed = false;
    let imageViewed = false;
    let animationInProgress = false;
    let delayScrolling = false;
    let animationCompleted = false;

    const waitForAnimationComplete = () => {
      animationInProgress = true;
      //revert animationInProgress to false after 800ms for transition time
      setTimeout(() => {
        console.log("animation completed");
        animationInProgress = false;
      }, 800);
    }

    const handleAnimation = (type) => {
      let isContainerInView = extra.getBoundingClientRect().top < container.getBoundingClientRect().bottom;
      if (isContainerInView && !section.classList.contains(styles.sectionAnimationCompleted)) {
        // if (isContainerInView) {
        console.log("container in view")
        if (type === "mobile") {
          window.scrollTo(0, previousScrollY + 1);
        }
        if (!titleViewed) {
          title.classList.add(styles.titleShown);
          titleViewed = true;
          waitForAnimationComplete();
          return;
        }
        if (titleViewed && !paragraphViewed && !animationInProgress) {
          paragraph.classList.add(styles.bottomUpAnimationShow, styles.paragraphShown);
          paragraphViewed = true;
          waitForAnimationComplete();
          return;
        }
        if (paragraphViewed && !imageViewed && !animationInProgress) {
          animatedImage.classList.add(styles.bottomUpAnimationShow);
          imageViewed = true;
          waitForAnimationComplete();
          delayScrolling = true;
          console.log("final frame");
          setTimeout(() => {
            console.log("done");
            delayScrolling = false;
            animationCompleted = true;
          }, 1000);
          return;
        }
        if (animationCompleted) {
          extra.remove();
          section.classList.add(styles.sectionAnimationCompleted);
        }
      }
    }

    const handleDesktopScroll = (event) => {
      event.preventDefault();
      let moveY = event.deltaY;
      if (!animationInProgress && !delayScrolling) {
        console.log("animation not in progress");
        window.scrollTo(0, window.scrollY + moveY * 1);
      }
      let currentScrollY = window.scrollY;
      if (currentScrollY > previousScrollY) {
        if (animationInProgress || delayScrolling) {
          console.log("slowed down scrolling");
          window.scrollTo(0, window.scrollY + moveY * 0.001);
        }
        handleAnimation("desktop");
      }
      previousScrollY = currentScrollY;
    };

    window.addEventListener("wheel", throttle(handleDesktopScroll, 5), { passive: false });

    const handleMobileScroll = (event) => {
      let currentScrollY = window.scrollY;
      if (currentScrollY > previousScrollY) {
        handleAnimation("mobile");
      }
      previousScrollY = window.scrollY;
    }

    window.addEventListener("scroll", throttle(handleMobileScroll, 5), { passive: false });

    return () => {
      window.removeEventListener('wheel', handleDesktopScroll);
      window.removeEventListener('scroll', handleMobileScroll);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Engineered for testing, debugging, and development.
        </h1>
        <p className={`${styles.paragraph} ${styles.bottomUpAnimationHidden}`}>
          This is some additional text that will appear as you scroll down.
        </p>
        <img className={`${styles.animatedImage} ${styles.bottomUpAnimationHidden}`} src="https://placehold.co/400x550"
             alt="presentation"/>
      </div>
      <div className={styles.extra}></div>
    </section>
  );
};

export default AnimatedSection;