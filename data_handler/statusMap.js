const statusMap = {
    0: {status: "Created", next: "manager"},
    1: {status: "Engineering", next: "engineer"},
    2: {status: "Pending Manager Review", next: "manager"},
    3: {status: "Finished (Customer Review)", next: "customer"},
    4: {status: "Finished"}
}

export default statusMap;