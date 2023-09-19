import { Api } from "utility";
export class TooleService {

    static getAllJob = async () => {
        let getJobListUrl = process.env.REACT_APP_JOB_URL
        return Api.get(getJobListUrl)
            .catch ((error)=>{
                console.log(error);
            });
    };

    static getSpecificJob = async (jobName) => {
        let getSpecificJobUrl = process.env.REACT_APP_GET_SPECIFIC_JOB_URL.replace(':name', jobName);
        return Api.get(getSpecificJobUrl)
            .catch ((error)=>{
                console.log(error);
            });
    };

    static monitor = async () => {
        let monitorUrl = process.env.REACT_APP_JOBS_MONITOR;
        return Api.get(monitorUrl)
            .catch ((error)=>{
                console.log(error);
            });
    };

    static checkJob = async (jobName) => {
        let checkJobUrl = process.env.REACT_APP_JOB_CHECK.replace(':name', jobName);
        return Api.get(checkJobUrl)
            .catch ((error)=>{
                console.log(error);
            });
    };

    static addJob = async (jobData) => {
        let addJobUrl = process.env.REACT_APP_JOB_URL;
        return Api.post(addJobUrl, jobData)
            .catch ((error)=>{
                console.log(error);
            });
    };

    static updateJob = async (jobId, editedJobData) => {
        let updateJobUrl = process.env.REACT_APP_SPECIFIC_JOB_URL.replace(':id', jobId);
        return Api.put(updateJobUrl, editedJobData)
            .catch ((error)=>{
                console.log(error);
            });
    };

    static deleteJob = async (jobId) => {
        let deleteJobUrl = process.env.REACT_APP_SPECIFIC_JOB_URL.replace(':id', jobId);
        return Api.delete(deleteJobUrl)
            .catch ((error)=>{
                console.log(error);
            });
    };
}