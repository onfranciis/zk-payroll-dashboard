function PayrollSummary() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Payroll</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">$124,500</p>
                <span className="text-green-500 text-sm font-medium">+12% from last month</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Active Employees</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">48</p>
                <span className="text-gray-500 text-sm font-medium">2 new this week</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                <span className="text-yellow-500 text-sm font-medium">Action required</span>
            </div>
        </div>
    );
}

export default PayrollSummary;