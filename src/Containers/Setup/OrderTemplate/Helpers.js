//converting the coordinatres into x,y, height and width
export const convertCoordinates = (coordinates) => {
  let cords = coordinates.replace(/[{()}]/g, "").split(",");
  return {
    x: parseFloat(cords[0]) || "",
    y: parseFloat(cords[1]) || "",
    height: `${cords[2]}px` || "",
    width: `${cords[3]}px` || "",
  };
};

//updating the coordinates
export const updateCoordinates = (obj) => {
  let { x, y, height, width } = obj;
  x = x || "";
  y = y || "";
  height = height || "";
  width = width || "";

  height = height.replace("px", "") || "";
  width = width.replace("px", "") || "";
  return `(${x},${y},${height},${width})`;
};

//updating the coordinates in templateFields
export const updateTemplateFields = (templateFields) => {
  return templateFields.map((item) => {
    let coordinates = updateCoordinates(item);

    return {
      field: item.field,
      coordinates,
    };
  });
};
