function PayrollSummary() {
  return (
    <section aria-labelledby="payroll-summary-heading">
      <h2 id="payroll-summary-heading" className="sr-only">
        Payroll Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" role="list">
        <article className="bg-white p-6 rounded-lg shadow-sm" role="listitem">
          <h3 className="text-sm font-medium text-gray-600">Total Payroll</h3>
          <p
            className="text-3xl font-bold text-gray-900 mt-2"
            aria-live="polite"
          >
            $124,500
          </p>
          <span className="text-green-700 text-sm font-medium">
            +12% from last month
          </span>
        </article>
        <article className="bg-white p-6 rounded-lg shadow-sm" role="listitem">
          <h3 className="text-sm font-medium text-gray-600">
            Active Employees
          </h3>
          <p
            className="text-3xl font-bold text-gray-900 mt-2"
            aria-live="polite"
          >
            48
          </p>
          <span className="text-gray-600 text-sm font-medium">
            2 new this week
          </span>
        </article>
        <article className="bg-white p-6 rounded-lg shadow-sm" role="listitem">
          <h3 className="text-sm font-medium text-gray-600">
            Pending Approvals
          </h3>
          <p
            className="text-3xl font-bold text-gray-900 mt-2"
            aria-live="polite"
          >
            3
          </p>
          <span className="text-yellow-700 text-sm font-medium">
            Action required
          </span>
        </article>
      </div>
    </section>
  );
}

export default PayrollSummary;
