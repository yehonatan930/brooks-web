import { onCLS, onFID, onLCP } from 'web-vitals';

const reportWebVitals = (metric) => {
  // You can log, send the metrics to an analytics endpoint, or store them
  console.log(metric);
};

// Report CLS, FID, and LCP
onCLS(reportWebVitals);
onFID(reportWebVitals);
onLCP(reportWebVitals);

export default reportWebVitals;