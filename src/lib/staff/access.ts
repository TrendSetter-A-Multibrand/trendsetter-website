export type StaffRole = "owner" | "store";

export type Staff = {
  id: number;
  login: string;
  name: string;
  role: StaffRole;
  /** Story uuids of the stores a store admin looks after; unused for an owner. */
  storeUuids: string[];
};

/**
 * An owner sees every event. A store admin sees an event only when its store is
 * one of theirs: an event with no store set belongs to nobody but the owner.
 */
export function canSeeEvent(staff: Staff, eventStore: string): boolean {
  if (staff.role === "owner") return true;
  return eventStore !== "" && staff.storeUuids.includes(eventStore);
}
