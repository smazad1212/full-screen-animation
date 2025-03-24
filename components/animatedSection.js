'use client';

import { useEffect } from 'react';
import styles from '@/app/page.module.css';

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

    const waitForAnimationComplete = () => {
      animationInProgress = true;
      //revert animationInProgress to false after 800ms for transition time
      setTimeout(() => {
        console.log("animation completed");
        animationInProgress = false;
      }, 800);
    }

    const handleAnimation = (direction) => {
      let isContainerInView = (extra.getBoundingClientRect().top < container.getBoundingClientRect().bottom) && !(container.getBoundingClientRect().top < 0);
      if (isContainerInView) {
        console.log("container in view: ", isContainerInView, direction);
        if (direction === "down") {
          if (!titleViewed && !animationInProgress) {
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
            setTimeout(() => {
              window.scrollTo(0, scrollY + extra.getBoundingClientRect().top);
              delayScrolling = false;
            }, 1000);
            return;
          }
        } else if (direction === "up") {
          if (imageViewed && !animationInProgress) {
            animatedImage.classList.remove(styles.bottomUpAnimationShow);
            imageViewed = false;
            waitForAnimationComplete();
            return;
          }
          if (!imageViewed && paragraphViewed && !animationInProgress) {
            paragraph.classList.remove(styles.bottomUpAnimationShow, styles.paragraphShown);
            paragraphViewed = false;
            waitForAnimationComplete();
            return;
          }
          if (!paragraphViewed && titleViewed && !animationInProgress) {
            title.classList.remove(styles.titleShown);
            titleViewed = false;
            waitForAnimationComplete();
            delayScrolling = true;
            setTimeout(() => {
              window.scrollTo(0, scrollY + section.getBoundingClientRect().top);
              delayScrolling = false;
            }, 1000);
            return;
          }
        }
      }
    }

    function handleScroll() {
      let currentScrollY = window.scrollY;
      if (animationInProgress || delayScrolling) {
        console.log("slow down scrolling");
        window.scrollTo(0, previousScrollY);
        return;
      }
      if (currentScrollY >= previousScrollY) {
        handleAnimation("down");
      }
      else {
        handleAnimation("up");
      }
      previousScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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