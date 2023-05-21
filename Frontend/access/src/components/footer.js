import React from "react";
import { Link } from "react-router-dom";
import { mainIcon } from "../data/logo";
import { socialsIcon } from "../data/socials";
import { navLinks } from "../data/navlinks";

export default function Footer() {
  return (
    <footer className="shadow-inner">
      <div className="flex justify-between items-center px-10">
        <div className="flex-col items-center">
        {mainIcon.map((main) => (
            <Link to={main.link} className="flex cursor-pointer items-center">
              <img
                src={main.icon}
                alt={main.alt}
                className="w-[40px] h-[38px]"
              />
              <span className="ml-2 text-xl font-bold">{main.name}</span>
            </Link>
          ))}
          <div className="mr-7 mt-5">PDF made easy</div>
        </div>

        <div className="flex">
          <ul className="md:mx-8 my-8">
            <span className="font-semibold">Solutions</span>
            {navLinks.map((link) => (
              <li key={link.name} className="md:my-4 my-8">
                <Link
                  to={link.link}
                  className="md:text-gray-800 text-neutral-200 hover:text-gray-400 duration-500"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex">
          <ul className="md:mx-8 my-8 ml-4">
            <span className="font-semibold">Support</span>
            <li className="md:my-4 my-8">
              <Link
                to="/"
                className="md:text-gray-800 text-neutral-200 hover:text-gray-400 duration-500"
              >
                About us
              </Link>
            </li>
            <div className="flex">
            {socialsIcon.map((icons) => (
              <li key={icons.name} className="mr-10 my-10">
                <Link to={icons.link}>
                  <img
                    src={icons.icon}
                    alt={icons.alt}
                    className="h-[30px] w-[30px]"
                  />
                </Link>
              </li>
            ))}
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}
