import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-200 py-8 w-full mt-32 px-5 ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-lg font-bold">&copy; 2024 Workler. All rights reserved.</p>
          <p className="mt-2 text-sm font-medium">Made with ❤️ by Team</p>
        </div>
        <ul className="flex justify-center md:justify-end font-medium">
          <li className="mx-4"><a href="#" className="hover:text-blue-500">Home</a></li>
          <li className="mx-4"><a href="#" className="hover:text-blue-500">About</a></li>
          <li className="mx-4"><a href="#" className="hover:text-blue-500">Services</a></li>
          <li className="mx-4"><a href="#" className="hover:text-blue-500">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
