import React from "react";

interface TitleSectionProps {
  title: string;
  subHeading?: string;
  pill?: string;
}

function TitleSection({ title, subHeading, pill }: TitleSectionProps) {
  return (
    <>
      <section className="flex flex-col items-start justify-center md:items-center mt-20 ">
        <article className="rounded-full p-[1px] text-sm dark:bg-gradient-to-r dark:from-brand-primary-blue dark:to-brand-primary-purple my-10">
          <div className="rounded-full  px-3 py-1 dark:bg-black">
            {pill}
          </div>
        </article>
        {subHeading ? (
          <>
            <h2 className="text-left text-4xl sm:text-6xl sm:max-w-[750px] md:text-center font-semibold">
              {title}
            </h2>
            <p className="dark:text-washed-purple-700 my-10 sm:max-w-[450px] md:text-center">
              {subHeading}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-left text-4xl sm:text-6xl sm:max-w-[850px] md:text-center font-semibold">
              {title}
            </h1>
          </>
        )}
      </section>
    </>
  );
}

export default TitleSection;
