import "./BreadCrumbs.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FC } from "react";
import { ROUTES } from "../modules/Routes";

interface ICrumb {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  crumbs: ICrumb[];
}

export const BreadCrumbs: FC<BreadCrumbsProps> = (props) => {
  const { crumbs } = props;
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="breadcrumbs-container">
      <div className="burger-icon" onClick={toggleMenu}>
        ☰
      </div>
      <ul className={`breadcrumbs ${showMenu ? "show" : ""}`}>
        <li>
          <Link to={ROUTES.START}>Главная</Link>
        </li>
        {!!crumbs.length &&
          crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {!showMenu && <li className="slash">/</li>} {/* Условный разделитель */}
              {index === crumbs.length - 1 ? (
                <li>{crumb.label}</li>
              ) : (
                <li>
                  <Link to={crumb.path || ""}>{crumb.label}</Link>
                </li>
              )}
            </React.Fragment>
          ))}
      </ul>
    </div>
  );
};
