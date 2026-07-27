import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function LibraryCharts({ readingStatusData, ratingData }) {
  const hasStatusData = readingStatusData.some((item) => item.count > 0);

  const hasRatingData = ratingData.some((item) => item.count > 0);

  return (
    <section className="mb-4">
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5 card-title">Books by Reading Status</h2>

              <p className="text-secondary">The number of books in each reading category.</p>

              {hasStatusData ? (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={readingStatusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ status, count }) => `${status}: ${count}`}
                      />

                      <Tooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="alert alert-light border mb-0">Add books to your library to see reading-status statistics.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5 card-title">Rating Distribution</h2>

              <p className="text-secondary">The number of books assigned each rating.</p>

              {hasRatingData ? (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={ratingData}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}>
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="ratingLabel"
                        label={{
                          value: "Rating",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />

                      <YAxis
                        allowDecimals={false}
                        label={{
                          value: "Books",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />

                      <Tooltip />

                      <Bar dataKey="count" name="Books" fill="#0d6efd" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="alert alert-light border mb-0">Rate at least one book to see rating statistics.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LibraryCharts;
