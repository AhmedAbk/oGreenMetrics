"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { userMenuItems, menuItems } from "@/lib/Data";

const Sidebar = ({ user, isAdmin, isCollapsed, setIsCollapsed }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState([]);

  // Colors
  const colors = {
    primary: "#ffffff", 
    white: "#000", 
    lightAccent: "#5a7814",
    green: "#8ebe21",
    darkAccent: "#f0ffe0", 
    textDark: "#2c3e0e",
    borderColor: "rgba(255, 255, 255, 0.15)", 
  };
  

  useEffect(() => {
    if (isAdmin) {
      if (user?.role === "Admin") {
        setItems(
          menuItems.filter(
            (item) => item.label !== "Profile" && item.label !== "Settings"
          )
        );
      } else if (user?.AdminRoles) {
        const filteredMenuItems = menuItems.filter((item) => {
          if (!item?.service) return true;
          return user.AdminRoles[item?.service] !== "00";
        });

        setItems(
          filteredMenuItems.filter(
            (item) => item.label !== "Profile" && item.label !== "Settings"
          )
        );
      }
    } else {
      setItems(
        userMenuItems.filter(
          (item) => item.label !== "Profile" && item.label !== "Settings"
        )
      );
    }
  }, [isAdmin, user]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
  };

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isLinkActive = (href) => {
    return pathname === href;
  };

  const isDropdownActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => pathname === child.href);
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:4000/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        document.cookie =
          "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="sidebar">
      <div
        className="position-fixed top-0 start-0 bottom-0 
        overflow-y-auto shadow-lg"
        style={{
          display: "flex",
          flexDirection: "column",
          zIndex: 1030,
          width: isCollapsed ? "60px" : "260px",
          transition: "width 0.3s ease",
          left: 0,
          height: "100vh",
          backgroundColor: colors.primary,
         
        }}
      >
        <div
          className="d-flex align-items-center p-[0.8rem] "
          style={{
            justifyContent: isCollapsed ? "center" : "space-between",
            backgroundColor: colors.primary,
            borderBottom: `1px solid ${colors.borderColor}`,
          }}
        >
          {!isCollapsed && (
            <div className="d-flex align-items-start">
              <span className="text-xl font-bold text-primary">Green</span>{" "}
              <span
                className="text-xl font-medium"
                style={{ color: colors.green }}
              >
                Metrics
              </span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="btn p-1 rounded-circle"
            style={{
              cursor: "pointer",
              backgroundColor: colors.green,
              color: colors.primary,
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <div className="p-2 flex-grow-1">
          <ul className="nav flex-column gap-2">
            {items.map((item) => (
              <li key={item.label} className="nav-item">
                {item.type === "dropdown" ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`nav-link 
                        p-2 rounded text-decoration-none w-full ${
                          isCollapsed
                            ? "items-center justify-center"
                            : "items-center"
                        } `}
                      style={{            
                        color:"#fff",
                        textAlign: "left",
                        fontWeight:
                          openDropdown === item.label || isDropdownActive(item)
                            ? 600
                            : 400,
                      }}
                    >
                      <div
                        style={{ gap: isCollapsed ? "0px" : "10px" }}
                        className="d-flex align-items-center "
                      >
                        <item.icon
                          size={22}
                          
                          style={{
                            color: isLinkActive(item.href) ? colors.primary : colors.white,
                          
                          }}
                        />

                        {!isCollapsed && (
                          <span className="text-sm font-medium" 
                          style={{color: isLinkActive(item.href) ? colors.primary : colors.white}}>
                            {item.label}
                          </span>
                        )}

                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className="ms-auto"
                          style={{
                            color: isLinkActive(item.href) ? colors.primary : colors.white,
                            opacity:
                              openDropdown === item.label ||
                              isDropdownActive(item)
                                ? 1
                                : 0.85,
                            transform:
                              openDropdown === item.label
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                          size={18}
                        />
                      )}
                    </button>
                    <div
                      className={`flex flex-col  items-center justify-center ${
                        openDropdown === item.label ? "d-block" : "d-none"
                      }`}
                      style={{
                        transition: "height 0.3s ease",
                        marginLeft: !isCollapsed && openDropdown === item.label ? "12px" : "",
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`
                          flex items-center rounded p-2 my-1 transition-all duration-200
                          ${isCollapsed ? "justify-center" : "gap-2"}
                        `}
                          style={{
                            backgroundColor: isLinkActive(child.href)
                            ? "rgba(142, 190, 33, 1)"
                            : "transparent",
                            color: isLinkActive(child.href) ? colors.primary : colors.white,
                            opacity: isLinkActive(child.href) ? 1 : 0.85,
                            fontWeight: isLinkActive(child.href) ? 500 : 400,
                          }}
                        >
                          <child.icon size={18} style={{color: isLinkActive(child.href) ? colors.primary : colors.white}}/>
                          {!isCollapsed && <span className="font-normal" style={{color: isLinkActive(child.href) ? colors.primary : colors.white}}>{child.label}</span>}
                          
                        </Link>
                      ))}
                    </div>
                  
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`nav-link 
                      p-2 rounded text-decoration-none ${
                        isCollapsed
                          ? "items-center justify-center"
                          : "items-center"
                      } `}
                    style={{
                      backgroundColor: isLinkActive(item.href)
                      ? "rgba(142, 190, 33, 1)"
                      : "transparent",
                      color: isLinkActive(item.href) ? colors.primary : colors.white,
                      opacity: isLinkActive(item.href) ? 1 : 0.85,
                      fontWeight: isLinkActive(item.href) ? 600 : 400,

                      gap: isCollapsed ? "0px" : "10px",
                    }}
                  >
                    <item.icon size={22} className="" style={{color: isLinkActive(item.href) ? colors.primary : colors.white,}} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium" style={{color: isLinkActive(item.href) ? colors.primary : colors.white,}}>{item.label}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{ borderTop: `1px solid ${colors.borderColor}` }}
          className="p-2"
        >
          <ul className="nav flex-column gap-2 mb-3">
            {["Profile", "Settings"].map((label) => {
              const item = (isAdmin ? menuItems : userMenuItems).find(
                (i) => i.label === label
              );
              return (
                item && (
                  <li key={item.label} className="nav-item">
                    <Link
                      href={item.href}
                      className={`nav-link 
                       p-2 rounded text-decoration-none ${
                         isCollapsed
                           ? "items-center justify-center"
                           : "items-center"
                       } `}
                      style={{
                        backgroundColor: isLinkActive(item.href)
                          ? "rgba(142, 190, 33, 1)"
                            : "transparent",
                        color: isLinkActive(item.href) ? colors.primary : colors.white,
                        opacity: isLinkActive(item.href) ? 1 : 0.85,
                        fontWeight: isLinkActive(item.href) ? 600 : 400,

                        gap: isCollapsed ? "0px" : "10px",
                      }}
                    >
                      <item.icon size={22} style={{color : isLinkActive(item.href) ? colors.primary : colors.white,}} />
                      {!isCollapsed && (
                        <span style={{color : isLinkActive(item.href) ? colors.primary : colors.white,}}  className="text-sm font-medium" >
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              );
            })}
          </ul>

          <button
            onClick={logout}
            className="btn d-flex align-items-center 
            justify-content-center gap-2 w-100"
            style={{
              backgroundColor: colors.green,
              color: colors.primary,
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              fontWeight: 500,
            }}
            
          >
            <LogOut size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
