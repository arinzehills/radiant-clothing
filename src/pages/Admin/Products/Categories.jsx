import { Icon } from "@iconify/react";
import React, { useState } from "react";
import AnimatedModal from "../../../components/AnimatedModal/AnimatedModal";
import { Button } from "../../../components/Button/Button";
import Table from "../../../components/Table/Table";
import useFetch from "../../../useFetch";
import handleDelete from "../../../utils/handleDelete";
import AddCategories from "./AddCategories";

const Categories = ({ setHandleNotData }) => {
  const [openModal, setOpenModal] = useState(false);
  const {
    data: categoriesData,
    loading,
    error,
  } = useFetch({
    url: window.baseUrl + "admin/getCategories",
    secondParam: openModal,
  });
  let columnData = [
    { heading: "S/N", value: "sn" },
    { heading: "Image", value: "image" },
    { heading: "Main Category", value: "super_category" },
    { heading: "Category", value: "category" },
    { heading: "Delete", value: "delete" },
  ];
  let categoriesImage = [];
  !loading &&
    categoriesData?.categories.forEach((cat, index) => {
      cat.delete = (
        <Icon
          icon="ic:baseline-delete"
          color="var(--danger)"
          style={{ paddingLeft: "20px", fontSize: "1.5rem" }}
          onClick={() =>
            handleDelete(
              window.baseUrl + "admin/deleteCategory?id=" + cat._id,
              setOpenModal
            )
          }
        />
      );
      cat.sn = (
        <p
          icon="ic:baseline-delete"
          color="var(--danger)"
          style={{ paddingLeft: "20px", fontSize: "1rem" }}
        >
          {index + 1}
        </p>
      );
    });
  console.log(categoriesImage);

  return (
    <div>
      <AnimatedModal
        modalHeight={"33rem"}
        openModal={openModal}
        setOpenModal={setOpenModal}
      >
        <AddCategories
          setHandleNotData={setHandleNotData}
          setOpenModal={setOpenModal}
        />
      </AnimatedModal>
      <div
        style={{
          marginTop: window.innerWidth < 660 && "2rem",
        }}
      >
        <Button
          buttonStyle={"btn--normal"}
          buttonColor="orange"
          style={{ color: "white " }}
          onClick={() => setOpenModal(true)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Icon
              icon="material-symbols:add-circle-outline"
              fontSize={"20px"}
            />
            Add Categories
          </div>
        </Button>
      </div>
      <Table
        loading={loading}
        data={categoriesData?.categories}
        columnData={columnData}
      />
    </div>
  );
};

export default Categories;
