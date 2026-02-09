import { useState, useEffect } from "react";
import { Dropdown } from "antd";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SunLogo from "../../assets/logo/Sun-Group-logo.png";

type MenuItem = {
  name: string;
  href: string;
  children?: {
    name: string;
    href: string;
  }[];
};

const menuItems: MenuItem[] = [
  {
    name: "Trang chủ",
    href: "/",
  },
  {
    name: "Dự án căn hộ Sun Group",
    href: "/#",
    children: [
      { name: "Căn hộ Studio", href: "/#studio" },
      { name: "Căn hộ 1 phòng ngủ", href: "/#1pn" },
      { name: "Căn hộ 2 phòng ngủ", href: "/#2pn" },
      { name: "Căn hộ 3 phòng ngủ", href: "/#3pn" },
    ],
  },
  {
    name: "Dự án Vin Home",
    href: "/#",
    children: [
      { name: "Căn hộ Studio", href: "/#studio" },
      { name: "Căn hộ 1 phòng ngủ", href: "/#1pn" },
      { name: "Căn hộ 2 phòng ngủ", href: "/#2pn" },
      { name: "Căn hộ 3 phòng ngủ", href: "/#3pn" },
    ],
  },
  {
    name: "Dự án căn hộ cao cấp khác",
    href: "/#",
    children: [
      { name: "Căn hộ Penthouse", href: "/#penthouse" },
      { name: "Căn hộ Duplex", href: "/#duplex" },
      { name: "Biệt thự cao tầng", href: "/#biet-thu" },
    ],
  },
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // init on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Global"
        className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-300 lg:px-8 ${
          isScrolled ? "p-4 sm:p-4" : "p-5 sm:p-6"
        }`}
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Sun Group</span>
            <img
              alt="Sun Group"
              src={SunLogo}
              className={`w-auto transition-all duration-300 ${isScrolled ? "h-10" : "h-12"}`}
            />
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 bg-transparent transition-colors ${
              isScrolled
                ? "text-gray-600 hover:text-gray-900"
                : "text-white hover:text-white/80"
            }`}
          >
            <span className="sr-only">Mở menu</span>
            <Bars3Icon aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-12">
          {menuItems.map((item) =>
            item.children ? (
              <div
                key={item.name}
                className={`border-r pr-4 ${isScrolled ? "border-gray-200" : "border-white/30"}`}
              >
                <Dropdown
                  menu={{
                    items: item.children.map((child) => ({
                      key: child.name,
                      label: (
                        <a
                          href={child.href}
                          className={
                            !isScrolled
                              ? "!text-white hover:!text-white/90"
                              : ""
                          }
                        >
                          {child.name}
                        </a>
                      ),
                      style: {
                        padding: "8px 16px",
                        fontSize: "14px",
                        ...(!isScrolled && { backgroundColor: "transparent" }),
                      },
                    })),
                    style: {
                      minWidth: 240,
                      padding: "6px 0",
                      ...(!isScrolled && {
                        backgroundColor: "transparent",
                        border: "none",
                        boxShadow: "none",
                      }),
                    },
                  }}
                  trigger={["hover"]}
                  placement="bottom"
                >
                  <span
                    className={`flex items-center gap-x-1 text-base/7 font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                      isScrolled
                        ? "text-gray-800"
                        : "text-white hover:text-white/90"
                    }`}
                  >
                    {item.name}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className={`size-4 flex-none ${isScrolled ? "text-gray-500" : "text-white/80"}`}
                    />
                  </span>
                </Dropdown>
              </div>
            ) : (
              <a
                key={item.name}
                href={item.href}
                className={`text-base/7 font-semibold border-r pr-6 whitespace-nowrap transition-colors ${
                  isScrolled
                    ? "text-gray-800 hover:text-gray-600 border-gray-200"
                    : "text-white hover:text-white/90 border-white/30"
                }`}
              >
                {item.name}
              </a>
            ),
          )}
        </div>
        <div className="hidden lg:block  pl-4">
          <button className="text-base font-semibold text-white bg-red-600 hover:bg-red-700 border-0 transition-all duration-300 px-4 py-1.5 rounded-md">
            Liên hệ tư vấn
          </button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Sun Group</span>
              <img alt="Sun Group" src={SunLogo} className="h-8 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-600 bg-transparent hover:bg-gray-100"
            >
              <span className="sr-only">Đóng menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-1 py-6">
                {menuItems.map((item) =>
                  item.children ? (
                    <Disclosure key={item.name} as="div">
                      <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2.5 px-3 text-base font-semibold text-gray-900 bg-transparent hover:bg-gray-50 border-0">
                        {item.name}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-5 flex-none text-gray-500 group-data-[open]:rotate-180 transition-transform"
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-1 space-y-1 pl-3">
                        {item.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-lg py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600"
                          >
                            {child.name}
                          </a>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg py-2.5 px-3 text-base font-semibold text-gray-900 hover:bg-gray-50 hover:text-red-600"
                    >
                      {item.name}
                    </a>
                  ),
                )}
              </div>
              <div className="py-6">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-lg bg-red-600 px-4 py-3 text-base font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Header;
