import TitleSection from "@/components/landingPage/titleSection";
import { Button } from "@/components/ui/button";
import React from "react";
import AppBanner from "../../../public/appBanner.png";
import Image from "next/image";
import { CLIENTS } from "@/lib/CONSTANT";
function page() {
  return (
    <>
      <section className="overflow-hidden px-4 sm:px-6 mt-10  sm:flex  sm:flex-col gap-4 md:justify-center md:items-center">
        <TitleSection
          pill="✨ Your Ideas, Organized"
          title="The All-in-One Workspace for Teams and Creators"
        />
        <div className="p-[2px] bg-white mt-6 rounded-xl bg-gradient-to-r from-primary to-brand-primary-blue sm:w-[300px]">
          <Button
            variant={"secondary"}
            className="w-full rounded-[13px] p-6 text-2xl bg-background"
          >
            Get Arcane Free
          </Button>
        </div>
        <div className="md:mt-[-90px] sm:w-full w-[750px] flex justify-center items-center mt-[-40px] relative sm:ml-0 ml-[-50px]">
          <Image
            src={AppBanner}
            alt="App Banner"
            className="mask-b-from-35%"
          ></Image>
        </div>
      </section>
      <section className="relative">
        <div className="overflow-hidden flex after:content-[''] after:dark:from-brand-dark after:to-transparent after:from-background after:bg-gradient-to-l after:right-0 after:bottom-0 after:top-0 after:w-20 after:absolute after:z-10  before:content-[''] before:dark:from-brand-dark before:to-transparent before:from-background before:bg-gradient-to-r before:left-0 before:bottom-0 before:w-20 before:top-0  before:z-10 before:absolute">

          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-nowrap animate-slide"
            >
              {CLIENTS.map((client, idx) => (
                <div key={idx} className="relative w-[200px] m-20 shrink-0 flex items-center">
                  <Image
                    src={client.logo}
                    alt={client.alt}
                    width={200}
                    className=" object-contain max-w-none"
                  />

                  </div>
              ))}
              
            </div>
          ))}

        </div>
      </section>
    </>
  );
}

export default page;
