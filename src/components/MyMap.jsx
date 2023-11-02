import { useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import countries from "../data/countries.json";
import emissions from "../data/emission-data.json";
import "leaflet/dist/leaflet.css";
import "./MyMap.css";
import SidePanel from "./SidePanel";

function MyMap() {
	// console.log(emissions);
	const [pickedCountry, setPickedCountry] = useState(null);
	const [showSidePanel, setShowSidePanel] = useState(false);
	const mergedData = [];
	countries.features.forEach((country) => {
		let countryName = country.properties.ADMIN;

		let countryEmission = emissions.filter(
			(emission) => emission.country === countryName
		);

		if (countryEmission.length > 0) {
			country.properties.emission = countryEmission[0];
			mergedData.push(country);
		}
	});

	// console.log(mergedData);
	const emissionsArray = mergedData.map(
		(country) => country.properties.emission.emissions
	);
	const minEmission = Math.min(...emissionsArray);
	const maxEmission = Math.max(...emissionsArray);

	mergedData.forEach((country) => {
		country.properties.emissionScale =
			(country.properties.emission.emissions - minEmission) /
				(maxEmission - minEmission) || 0;
	});

	// console.log(mergedData);

	const countryStyle = {
		fillColor: "#4E7358",
		fillOpacity: 1, // between 0 and 1
		color: "black",
		weight: 2,
	};

	const mouseOverHandler = (event) => {
		event.target.setStyle({
			color: "green",
			fillColor: "yellow",
			fillOpacity: 0.2,
		});
	};

	const mouseOutHandler = (event) => {
		event.target.setStyle(countryStyle);
	};

	const onEachFeatureHandler = (country, layer) => {
		let countryName = country.properties.ADMIN;
		let countryISO3 = country.properties.ISO_A3;

		let emission = mergedData.find(
			(country) => country.properties.ADMIN === countryName
		);
		layer.on({
			mouseover: mouseOverHandler,
			mouseout: mouseOutHandler,
			click: (event) => {
				// console.log(countryName);
				// console.log(emission);
				if (emission === undefined) {
					layer
						.bindPopup(
							countryName +
								"(" +
								countryISO3 +
								")<br/>" +
								"⚠️ Unavailable country data"
						)
						.openPopup();
				} else {
					setPickedCountry(emission);
					setShowSidePanel(true);
				}
				layer
					.bindPopup(
						countryName +
							"(" +
							countryISO3 +
							")" +
							"<br />" +
							"region: " +
							emission.properties.emission.region +
							"<br />" +
							"Lat: " +
							event.latlng.lat.toFixed(5) +
							", " +
							"Long: " +
							event.latlng.lng.toFixed(5) +
							"<br />" +
							"emissions: " +
							emission.properties.emission.emissions +
							"<br />" +
							"base year: " +
							emission.properties.emission.baseYear +
							"<br />" +
							"type: " +
							emission.properties.emission.type +
							"<br />" +
							"source: " +
							emission.properties.emission.source
					)
					.openPopup();
			},
		});
	};

	const handleCountryPicker = (event) => {
		// console.log(event.target.value);
		let countryName = event.target.value;
		let country = mergedData.filter(
			(country) => country.properties.ADMIN === countryName
		);
		setPickedCountry(country[0]);
		setShowSidePanel(true);
	};

	// console.log("picked country", pickedCountry);
	return (
		<div
			style={{
				textAlign: "center",
			}}
		>
			<div className="map-header">
				<h1 style={{ color: "#38403A" }}>MY MAP</h1>
				<select
					className="country-selector"
					name="countryPicker"
					value={pickedCountry ? pickedCountry.properties.ADMIN : ""}
					onChange={handleCountryPicker}
				>
					{mergedData.map((item, idx) => {
						// console.log(item);
						return (
							<option
								key={idx}
								className="country-option"
								value={item.properties.ADMIN}
							>
								{item.properties.ADMIN}
							</option>
						);
					})}
				</select>
				{showSidePanel && (
					<button
						className="side-panel"
						style={{
							border: "1px solid #38403A",
							borderRadius: "100%",
							padding: "5px",
							cursor: "pointer",
							height: "30px",
							width: "30px",
							textAlign: "center",
							backgroundColor: "white",
							color: "#38403A",
						}}
						onClick={() => {
							setShowSidePanel(false);
						}}
					>
						X
					</button>
				)}
			</div>
			<div className="container">
				{showSidePanel && (
					<div className="side-panel-container">
						<SidePanel data={pickedCountry} />
					</div>
				)}
				<div className="map">
					<MapContainer
						style={{ height: "80vh" }}
						zoom={2}
						center={[52.70946, -67.14844]}
						scrollWheelZoom={true}
					>
						<GeoJSON
							style={countryStyle}
							data={countries.features}
							onEachFeature={onEachFeatureHandler}
						/>
					</MapContainer>
				</div>
			</div>
		</div>
	);
}

export default MyMap;
