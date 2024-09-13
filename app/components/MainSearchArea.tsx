import { Link } from "@remix-run/react";

import amLogo from "~/assets/images/am.png";
import mxmLogo from "~/assets/images/mxm.png";

import AmTypography from "~/assets/images/am_typography.svg?react";
import MxmTypography from "~/assets/images/mxm_typography.svg?react";

export default function MainSearchArea() {
  return (
    <div className="max-w-[448px] h-screen bg-neutral-100 pt-[158px] pl-16">
      <Link
        to="/"
        role="main"
        className="flex items-center gap-4 cursor-pointer"
      >
        <img
          src={amLogo}
          alt="Apple Music Logo"
          className="size-[50px] rounded-[10px]"
        />
        <span
          className="material-symbols-rounded !text-[40px]"
          style={{
            fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 40`,
          }}
        >
          arrow_right_alt
        </span>
        <img
          src={mxmLogo}
          alt="Musixmatch Logo"
          className="size-[50px] rounded-[10px]"
        />
      </Link>

      <Link
        to="/"
        role="main"
        className="flex items-center gap-3 pr-[66px] pt-8 cursor-pointer"
      >
        <AmTypography className="h-7 fill-neutral-900" />
        <span className="font-sans font-medium text-neutral-900 text-[28px] mt-[2px]">
          to
        </span>
        <MxmTypography className="ml-[2px] mt-[2px] h-8 fill-neutral-900" />
      </Link>

      <form className="mt-16 w-[335px] relative">
        <input
          id="link-input"
          className="w-full pt-6 pl-1 pr-10 pb-2.5 bg-transparent border-0 border-b-[1.5px] border-b-neutral-800 outline-none text-lg text-neutral-800 peer"
          required
        />

        <label
          className="absolute left-1 top-[25.5px] font-sans text-base text-neutral-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-neutral-800 peer-valid:top-0 peer-valid:text-sm peer-valid:text-neutral-800 transition-all duration-500 ease-in-out"
          htmlFor="link-input"
        >
          Apple Music Track/Album link or ISRC
        </label>

        <button type="submit">
          <span
            className="material-symbols-rounded absolute top-[25.5px] right-1 !text-[26px] text-neutral-400"
            style={{
              fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
            }}
          >
            search
          </span>
        </button>
      </form>

      <div className="flex flex-col gap-6 absolute bottom-12">
        <div className="flex gap-3 text-neutral-500 font-sans text-sm font-medium">
          <Link to="/guide" className="underline">
            How to use
          </Link>
          <span>|</span>
          <Link to="/abstrack" className="underline">
            Get abstrack
          </Link>
          <span>|</span>
          <a
            href="https://spotify-to-mxm.vercel.app/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            From Spotify
          </a>
        </div>

        {/* <a
          href="https://lunaiz.com/"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-500 font-sans text-sm font-medium"
        >
          © LUNAIZ Corp.
        </a> */}

        <span className="text-neutral-500 font-sans text-sm font-medium">
          © LUNAIZ Corp.
        </span>
      </div>
    </div>
  );
}
