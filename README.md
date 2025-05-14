# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



<!-- 
check box to select all and un selectall button
select all and un selectall button to checkbox
all pagination logic correction 
 -->













<!-- 

 Ujjwal Roy
10:13 AM (0 minutes ago)
to me

import React, { useState } from "react";

export default function MenuForm() {
  // Initial state with one item
  const [menuInput, setMenuInput] = useState([
    {
      itemName: "",
      description: "",
      option: "",
    },
  ]);

  // Function to handle changes in input fields
  const handleMenuChange = (e, index) => {
    const { name, value } = e.target;

    const updatedInputs = [...menuInput];

   
    updatedInputs[index][name] = value;

    setMenuInput(updatedInputs);
  };

  const handleAddMenu = () => {
    setMenuInput((prev) => [
      ...prev,
      { itemName: "", description: "", option: "" },
    ]);
  };

  // Function to remove a specific row
  const handleRemoveMenu = (index) => {
    const updated = [...menuInput];
    updated.splice(index, 1);
    setMenuInput(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Menu Items Form</h2>

      {menuInput.map((input, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 15,
            borderRadius: 5,
          }}
        >
          {/* Item Name Input */}
          <div>
            <label>Item Name:</label>
            <input
              type="text"
              name="itemName"
              value={input.itemName}
              onChange={(e) => handleMenuChange(e, index)}
              placeholder="Enter item name"
              style={{ width: "100%", padding: 5, marginBottom: 10 }}
            />
          </div>

          {/* Description Input */}
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={input.description}
              onChange={(e) => handleMenuChange(e, index)}
              placeholder="Enter description"
              style={{ width: "100%", padding: 5, marginBottom: 10 }}
            />
          </div>

          {/* Radio Button Group */}
          <div>
            <label>Choose Option:</label>
            <div>
              <label>
                <input
                  type="radio"
                  name={`option-${index}`} // unique name per row
                  value="veg"
                  checked={input.option === "veg"}
                  onChange={(e) => handleMenuChange(e, index)}
                />
                Veg
              </label>
              <label style={{ marginLeft: 10 }}>
                <input
                  type="radio"
                  name={`option-${index}`} // unique name per row
                  value="nonveg"
                  checked={input.option === "nonveg"}
                  onChange={(e) => handleMenuChange(e, index)}
                />
                Non-Veg
              </label>
            </div>
          </div>

          {/* Remove Row Button */}
          <button
            onClick={() => handleRemoveMenu(index)}
            style={{
              marginTop: 10,
              background: "#f44336",
              color: "#fff",
              padding: "5px 10px",
              border: "none",
              borderRadius: 3,
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add New Item Button */}
      <button
        onClick={handleAddMenu}
        style={{
          background: "#2196f3",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: 3,
        }}
      >
        Add New Item
      </button>

      {/* Output */}
      <div style={{ marginTop: 30 }}>
        <h3>Preview Data:</h3>
        <pre>{JSON.stringify(menuInput, null, 2)}</pre>
      </div>
    </div>
  );
} -->


<!-- import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { PostImage, PostImageMultiple } from "../../../utils/apiCall";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";

export default function Index() {
  const [selectedRestaurantOption, setSelectedRestaurantOption] = useState("");
  const [selectedAddressOption, setSelectedAddressOption] = useState("");
  const [selectedMenuOption, setSelectedMenuOption] = useState("");
  const [selectedMenuAddressOption, setSelectedMenuAddressOption] = useState("");
  const [loader, setLoader] = useState(false);
  const [imgArr, setImgArr] = useState([]);
  const [parseData, setParseData] = useState([ /* your parsedData examples */ ]);
  const [menuValue, setMenuValue] = useState({});
  const [value, setValue] = useState({});
  const [input, seInput] = useState({ restaurantAddress: "", restaurantName: "" });

  const [menuInput, setMenuInput] = useState([{ itemName: "", description: "" }]);

  const handleMultipleMenu = async (e) => {
    const files = Array.from(e.target.files);
    const updatedImgArr = [...imgArr, ...files];
    setImgArr(updatedImgArr);
    const path = await PostImageMultiple(updatedImgArr);
    if (path?.length > 0) handleMultiplePath(path);
    e.target.value = null;
  };

  const ParseMenuData = async (index) => {
    try {
      setLoader(true);
      const data = { parsedData: parseData[index] };

      // Handling menu name logic
      if (selectedMenuOption) {
        if (selectedMenuOption === "startWith") data.nameStartWith = menuValue.nameStartWith;
        else if (selectedMenuOption === "endWith") data.nameEndWith = menuValue.nameEndWith;
        else if (selectedMenuOption === "between") {
          data.namestartFrom = menuValue.namestartFrom;
          data.nameendFrom = menuValue.nameendFrom;
        } else if (selectedMenuOption === "chef") data.namelineNumber = menuValue.namelineNumber;
      }

      // Handling menu address logic
      if (selectedMenuAddressOption) {
        if (selectedMenuAddressOption === "startWith") data.addressStartWith = menuValue.addressStartWith;
        else if (selectedMenuAddressOption === "endWith") data.addressEndWith = menuValue.addressEndWith;
        else if (selectedMenuAddressOption === "between") {
          data.addressstartFrom = menuValue.addressstartFrom;
          data.addressendFrom = menuValue.addressendFrom;
        } else if (selectedMenuAddressOption === "chef") data.addresslineNumber = menuValue.addresslineNumber;
      }

      const apiResponse = await callAPI(apiUrls.menuParser, {}, "POST", data);
      if (apiResponse?.data?.status) {
        const updatedInputs = [...menuInput];
        updatedInputs[index] = {
          itemName: apiResponse.data.data.menuName,
          description: apiResponse.data.data.menuDescription,
        };
        setMenuInput(updatedInputs);
      } else {
        ErrorMessage(apiResponse?.data?.message);
        const resetInputs = [...menuInput];
        resetInputs[index] = { itemName: "", description: "" };
        setMenuInput(resetInputs);
      }
      setLoader(false);
    } catch (error) {
      const resetInputs = [...menuInput];
      resetInputs[index] = { itemName: "", description: "" };
      setMenuInput(resetInputs);
      setLoader(false);
      ErrorMessage(error?.message);
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMenuInput = [...menuInput];
    updatedMenuInput[index][name] = value;
    setMenuInput(updatedMenuInput);
  };

  return (
    <div>
      <h2>Parsed Menus</h2>
      {parseData.map((item, index) => (
        <div key={index} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
          <h4>Menu #{index + 1}</h4>

          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              name="itemName"
              className="form-control"
              value={menuInput[index]?.itemName || ""}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              name="description"
              className="form-control"
              value={menuInput[index]?.description || ""}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>

          <div className="form-group">
            <label><strong>Choose Menu Option:</strong></label><br />
            {Object.entries({ startWith: "Start With", endWith: "End With", between: "Between", chef: "Line Number" }).map(
              ([value, label]) => (
                <label key={value} className="me-3">
                  <input
                    type="radio"
                    name={`menuOption-${index}`}
                    checked={selectedMenuOption === value}
                    onChange={() => setSelectedMenuOption(value)}
                  /> {label}
                </label>
              )
            )}
          </div>

          <button onClick={() => ParseMenuData(index)} className="btn btn-primary mt-2">Parse Menu #{index + 1}</button>
        </div>
      ))}
    </div>
  );
} -->
