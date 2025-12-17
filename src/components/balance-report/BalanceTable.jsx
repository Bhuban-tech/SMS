export default function BalanceTable({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
      <table className="w-full text-sm text-center">
        <thead className="bg-teal-700 text-white sticky top-0">
          <tr>
            {[
              "S.N",
              "Date",
              "Particular",
              "Dr",
              "Cr",
              "Balance",
              "Attachment",
              "User",
              "Source Remark",
            ].map((header) => (
              <th key={header} className="p-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.sn} className="border-b hover:bg-gray-100 transition">
              <td className="p-3">{row.sn}</td>
              <td className="p-3">{row.date}</td>
              <td className="p-3">{row.particular}</td>
              <td className="p-3 text-red-700">{row.dr}</td>
              <td className="p-3 text-green-700">{row.cr}</td>
              <td className="p-3">{row.balance}</td>
              <td className="p-3">{row.attachment}</td>
              <td className="p-3">{row.user}</td>
              <td className="p-3">{row.sourceRemark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
