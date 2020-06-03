export interface EstimatedTime {
    spanType: string;
    value: number;
}

export interface Complaint {
    _id: string;
    assignedTo: string;
    department: string;
    description: string;
    estimatedTime: EstimatedTime;
    issueId: string;
    status: string;
}