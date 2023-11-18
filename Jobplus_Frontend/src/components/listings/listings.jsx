import React, { useState, useEffect, Fragment } from "react";
import "./listings.scss";
import Paginate from "../paginate/paginate";
import { StarSaved, StarUnsaved, Money, Location, Timer } from "../images";
import { useApi } from "../../hooks/useApi";
import ConfirmationModal from "../confirmation_modal/Confirmation_Modal";

export default function listings() {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToSave, setJobToSave] = useState(null);

  const { get } = useApi();

  const MAX_PER_PAGE = 3;
  const MAX_LENGTH_CHARS = 200;

  const handleSuccess = (res) => {
    const { entries, meta } = res.data;
    /* Update each Job to include isTruncated */

    const updateJobs = entries.map((job) => ({
      ...job,
      isTruncated: true,
    }));
    setJobs(updateJobs);
    setMeta(meta);
  };

  const fetchJobs = async (page = 1) => {
    await get("jobs", {
      onSuccess: (res) => handleSuccess(res),
      params: {
        "populate[company]": true,
        "populate[job_types]": true,
        start: (page - 1) * MAX_PER_PAGE,
        limit: MAX_PER_PAGE,
      },
    });
  };

  const truncate = (text, jobId) => {
    const job = jobs.find((job) => job.id === jobId);

    const shouldTruncate = text.length > MAX_LENGTH_CHARS && job?.isTruncated;
    if (!shouldTruncate) return text;

    const truncated = text.slice(0, MAX_LENGTH_CHARS);
    return truncated + "...";
  };
  const toggleTruncate = (jobId) => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === jobId) {
        return { ...job, isTruncated: !job.isTruncated };
      }
      return job;
    });
    setJobs(updatedJobs);
  };

  const showModal = (job) => {
    setJobToSave(job);
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };

  const acceptModal = () => {
    console.log("Accept the saved Job", jobToSave);
    hideModal();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePageChange = (pageNumber) => {
    fetchJobs(pageNumber);
  };

  const total = meta?.pagination?.totalpages;

  console.log(Array.from({ length: total }));

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={hideModal}
        onAccept={acceptModal}
        text="You are about to save this Job. Are you sure?"
      />

      <section>
        {jobs.map((job) => {
          return (
            <div key={job.id} className="listing__card">
              <header className="listing__header">
                <h1 className="listing__title">{job.title}</h1>
                <img
                  className="listing__saved"
                  src={StarUnsaved}
                  alt=""
                  onClick={showModal}
                />
                <p className="listing__company">
                  Posted by <span>{job.company.name}</span>
                </p>
              </header>

              <ul className="listing__items">
                <li>
                  <img src={Money} alt="" />
                  <b>{job.salarytype}</b>
                </li>
                <li>
                  <img src={Location} alt="" />
                  <b>{job.location}</b>
                </li>
                <li>
                  <img src={Timer} alt="" />
                  {job.job_types.map((type, index, array) => (
                    <Fragment key={type.id}>
                      <span>{type.title}</span>
                      {index !== array.length - 1 && <span> ,</span>}
                    </Fragment>
                  ))}
                </li>
              </ul>

              <p className="listing__detail">
                {truncate(job.description, job.id)}
                <a onClick={() => toggleTruncate(job.id)}>
                  <b>{job.isTruncated ? "Read More" : "Read Less"}</b>
                </a>
              </p>

              <a href="" className="listing__cta">
                Withdraw application
              </a>
            </div>
          );
        })}
        <Paginate meta={meta.paginate} onPageChange={handlePageChange} />
      </section>
    </>
  );
}
