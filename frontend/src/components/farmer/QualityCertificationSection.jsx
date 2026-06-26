import { Plus, X, Pencil } from "lucide-react";

const gradeBadgeClasses = {
  A: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  B: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  C: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex items-center gap-1 shrink-0">
    {onEdit && (
      <button
        onClick={onEdit}
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
      >
        <Pencil className="w-4 h-4" />
      </button>
    )}
    <button
      onClick={onDelete}
      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default function QualityCertificationSection({
  qualityGrades,
  certifications,
  labTests,
  onOpenQualityGrade,
  onOpenCertification,
  onOpenLabTest,
  onOpenAudit,
  onDeleteQualityGrade,
  onDeleteCertification,
  onDeleteLabTest,
  onEditQualityGrade,
  onEditCertification,
  onEditLabTest,
}) {
  return (
    <div className="space-y-8">
      {/* Quality Grading */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Quality Grading
          </h3>
          <button
            onClick={onOpenQualityGrade}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quality Grade</span>
          </button>
        </div>
        {qualityGrades.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No quality grades recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {qualityGrades.map((grade) => {
              const gradeKey = grade.grade?.toUpperCase();
              return (
                <div
                  key={grade.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {grade.productName}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${gradeBadgeClasses[gradeKey] || gradeBadgeClasses.C}`}
                      >
                        Grade {grade.grade}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Assessed: {grade.assessmentDate || grade.testDate} |
                      Inspector: {grade.inspector || "N/A"}
                    </p>
                    {(grade.moistureContent || grade.notes) && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {grade.moistureContent
                          ? `Moisture: ${grade.moistureContent}% | `
                          : ""}
                        Notes: {grade.notes || "None"}
                      </p>
                    )}
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditQualityGrade
                        ? () => onEditQualityGrade(grade)
                        : null
                    }
                    onDelete={() => onDeleteQualityGrade(grade.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Certifications
          </h3>
          <button
            onClick={onOpenCertification}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>
        {certifications.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No certifications recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert) => {
              const today = new Date();
              const expiry = cert.expiryDate ? new Date(cert.expiryDate) : null;
              const daysLeft = expiry
                ? Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
                : null;
              const certStatus = !expiry
                ? null
                : daysLeft < 0
                  ? {
                      label: "Expired",
                      cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                    }
                  : daysLeft <= 30
                    ? {
                        label: "Expiring Soon",
                        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                      }
                    : {
                        label: "Valid",
                        cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                      };
              return (
                <div
                  key={cert.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {cert.certificationName}
                      </h4>
                      {certStatus && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${certStatus.cls}`}
                        >
                          {certStatus.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Issued: {cert.issueDate} | Expires: {cert.expiryDate}
                    </p>
                    {(cert.issuingAuthority ||
                      cert.issuingBody ||
                      cert.certificateNumber) && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Issuer:{" "}
                        {cert.issuingAuthority || cert.issuingBody || "N/A"}
                        {cert.certificateNumber
                          ? ` | Certificate #: ${cert.certificateNumber}`
                          : ""}
                      </p>
                    )}
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditCertification
                        ? () => onEditCertification(cert)
                        : null
                    }
                    onDelete={() => onDeleteCertification(cert.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lab Test Results */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Lab Test Results
          </h3>
          <button
            onClick={onOpenLabTest}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lab Test</span>
          </button>
        </div>
        {labTests.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No lab tests recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {labTests.map((test) => {
              const resultColor =
                test.result === "Pass"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : test.result === "Fail"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
              return (
                <div
                  key={test.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {test.testType}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${resultColor}`}
                      >
                        {test.result}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Lab: {test.laboratory} | Tested: {test.testedDate}
                    </p>
                    {test.notes && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {test.notes}
                      </p>
                    )}
                  </div>
                  <ActionButtons
                    onEdit={onEditLabTest ? () => onEditLabTest(test) : null}
                    onDelete={() => onDeleteLabTest(test.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Audit */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Request Quality Audit
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Schedule an official inspection of your farm or product batch
            </p>
          </div>
          <button
            onClick={onOpenAudit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Request Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
