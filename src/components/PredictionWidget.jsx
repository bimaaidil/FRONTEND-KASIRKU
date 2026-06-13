import React, { useState, useEffect } from 'react';

const PredictionWidget = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ganti URL sesuai dengan alamat API Flask Anda
    fetch('http://localhost:5000/api/predict')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPrediction(data.prediction);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching prediction:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 bg-blue-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-blue-800">
        Estimasi Stok Esok Hari
      </h3>
      {loading ? (
        <p className="text-gray-600">Menghitung...</p>
      ) : (
        <div className="mt-2">
          <span className="text-3xl font-bold text-blue-900">
            {prediction}
          </span>
          <span className="ml-2 text-blue-700 text-sm">Unit/Cup</span>
          <p className="text-xs text-blue-600 mt-1 italic">
            *Berdasarkan analisis Bi-LSTM
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionWidget;