import React from "react";
import css from "./About.module.scss";

const About = () => {
  return (
    <>
      <h1 className="h1">Welcome to Cerebro</h1>

      <div className={css.HomeText}>
        <p>
          Cerebro is the ultimate web app for all your image and video needs.
          With Cerebro, you can easily store, manage, and share your media files
          from anywhere in the world, all in one convenient place. Whether
          you're a professional photographer or videographer, or simply someone
          who wants to keep their media safe and organized, Cerebro is the
          perfect solution for you.
        </p>

        <h2 className="h3">Alpha Stage</h2>
        <p>
          Please note that Cerebro is currently in alpha stage and not yet
          available for sale. However, we're continuously improving the platform
          and adding new features to make it the best web drive solution
          available. We welcome you to join our community of early adopters and
          help shape the future of Cerebro.
        </p>

        <h2 className="h3">Media Walls</h2>
        <p>
          Cerebro offers a unique feature that allows you to create and share
          media walls. These media walls are similar to subreddits, where you
          can post your images and videos to a specific topic or theme. You can
          create a media wall for anything you want, such as travel, food, or
          nature, and invite others to join and contribute to the wall.
        </p>

        <p>
          At Cerebro, we believe that sharing is an integral part of the
          creative process. With media walls, we're providing a platform for
          creators to connect and collaborate, and we can't wait to see what
          amazing content you'll create. So why wait? Sign up for Cerebro today
          and start sharing your media with the world!
        </p>

        <p className="body2">Written by ai</p>
      </div>
    </>
  );
};

export default About;
