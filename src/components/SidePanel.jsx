function SidePanel({ data }) {
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: 1000,
				backgroundColor: "#50A667",
				color: "#29382D",
			}}
		>
			<h1>{data.properties.ADMIN}</h1>
			<div
				style={{
					margin: "20px",
					textAlign: "justify",
				}}
			>
				<p style={{ fontSize: "1rem" }}>
					Source: {data.properties.emission.source}
				</p>
				<p style={{ fontSize: "1rem" }}>
					Base year: {data.properties.emission.baseYear}
				</p>
				<p style={{ fontSize: "1rem" }}>
					Emission: {data.properties.emission.emissions}
				</p>
				<p style={{ fontSize: "1rem" }}>
					Type: {data.properties.emission.type}
				</p>
				<p style={{ fontSize: "1rem" }}>
					Reason: {data.properties.emission.reason}
				</p>
				<p style={{ fontSize: "1rem" }}>
					Segment: {data.properties.emission.segment}
				</p>
				<p style={{ fontSize: "1rem" }}>
					Notes: {data.properties.emission.notes}
				</p>
			</div>
		</div>
	);
}

export default SidePanel;
