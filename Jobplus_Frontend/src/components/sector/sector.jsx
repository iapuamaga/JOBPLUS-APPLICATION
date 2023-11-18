import React, { useEffect, useState } from "react";
import "./sector.scss";
import { useApi } from "../../hooks/useApi";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function sector() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sectors, setSectors] = useState([]);
  const [categories, setCategories] = useState([]);

  const { get } = useApi();

  const handleSuccess = (res) => {
    const {
      title,
      subtitle,
      sectors: { data: sectorArray },
    } = res.data.data.attributes;

    setTitle(title);
    setSubtitle(subtitle);
    setSectors(sectorArray);
  };

  const fetchHomeSector = async () => {
    await get("home-sector", {
      onSuccess: (res) => handleSuccess(res),
      params: {
        "populate[sectors][populate][categories][populate][jobs]": true,
        "populate[sectors][populate][smallImage]": true,
        "populate[sectors][populate][bigImage]": true,
        "populate[sectors][limit]": 3,
      },
    });
  };

  useEffect(() => {
    fetchHomeSector();
  }, []);

  return (
    <div className="sector">
      <h2>{title}</h2>
      <p>{subtitle}</p>

      <div className="sector__types">
        {sectors.map((sector) => {
          const { id, title, bigImage, smallImage, categories } =
            sector.attributes;
          const { url: smallImageurl } = smallImage.data.attributes;
          const { url: bigImageurl } = bigImage.data.attributes;

          console.log(categories);
          return (
            <div key={sector.id} className="sector__wrap">
              <picture className="sector__picture">
                <source
                  srcSet={`${BASE_URL}${bigImageurl}`}
                  media="(min-width: 767px)"
                />
                <source srcSet={`${BASE_URL}${smallImageurl}`} />
                <img src={`${BASE_URL}${smallImageurl}`} alt="" />
              </picture>
              <div className="sector__name">{title}</div>
              <ul className="sector__list">
                {categories.data.map((category) => {
                  const {
                    title,
                    jobs: { data: jobsArray },
                  } = category.attributes;
                  return (
                    <li>
                      <a href="">
                        {title}
                        <span>{jobsArray.length}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <a href="">
          <div className="sector__browse">Browse all sectors</div>
        </a>
        <ul className="sector__mlist">
          <li>
            <a href="">
              Accountancy jobs <span>5,757</span>
            </a>
          </li>
          <li>
            <a href="">
              Acturial jobs <span>5,757</span>
            </a>
          </li>
          <li>
            <a href="">
              Admin, Secretarial jobs <span>5,757</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
