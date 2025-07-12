import React, { useEffect } from "react";
import { useHouseholdStore } from "utils/householdStore";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  householdId: string;
}

const MemberList: React.FC<Props> = ({ householdId }) => {
  const { members, isLoading, error, fetchMembers } = useHouseholdStore();

  useEffect(() => {
    fetchMembers(householdId);
  }, [householdId, fetchMembers]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      {members.length === 0 ? (
        <p>No members found in this household.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="flex justify-between items-center p-2 border rounded">
              <span>{member.id}</span>
              <span className="text-sm text-gray-500">{member.role}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberList;
