import apiCaller from "./utils/apiCaller"
import errorHandler from "./utils/errorHandler"
import formHandler from "./utils/formHandler"
import htmlHandler from "./utils/htmlHandler"
import tokenHandler from "./utils/tokenHandler"
import authenticationPage from "./components/authentication"
import animationHandler from "./utils/animationHandler"
import indexPage from "./components/index"
import dataHandler from "./utils/dataHandler"

const functionInterface = (()=>{
    const returnUserStatus = ()=>{
        if(window.localStorage.getItem('token')!==null)
        {
            tokenHandler.addHeaderToken(window.localStorage.getItem('token'))
        }
        else
        {
            tokenHandler.deleteHeaderToken()
        }
        return apiCaller.postCall('check', "", {})
    }

    const changePage = (pageName, parent)=>{
        htmlHandler.clearDIV(parent)
        authenticationPage.generateAuthenticationForms(pageName, '')
    }


    const startingPage = ()=>{
        
        returnUserStatus().then(data=>{
            if(data.success==true)
            {
                window.localStorage.getItem('user')
                indexPage.generateMainPage()
                return data
            }
            else
            {
                tokenHandler.deleteHeaderToken()
                authenticationPage.generateAuthenticationForms('login')
                return data
            }
        })
        .then((data)=>{
            if (data.success==true)
            {
                animationHandler.openIndex(document.querySelector('.index-container'))
                
                return data
            }
            else
            {
                animationHandler.openForm(document.querySelector('.form-container'))
                return data
            }
            
        })
        .then((data)=>{
            if (data.success==true)
            {
                functionInterface.authenticationForm('logout', false)
            }
            else
            {
                functionInterface.authenticationForm('login', true)
            }
           
        })
    } 
    
    
    const authenticationForm = (formName, hasErrors)=>{
        const form = document.querySelector(`#${formName}-form`)
        let inputs = formHandler.getFormInputs(formName)
        if(hasErrors){errorHandler.addErrorEvents(inputs)}
        form.addEventListener('submit', (e)=>{
            e.preventDefault()
            let inputs
            let body = {}
            if(formName!="logout")
            {
                inputs = document.querySelector('input')
                htmlHandler.removeInputError(inputs)
                body = formHandler.getFormValues(formName)
            }
            apiCaller.postCall(formName, "", body)
            .then(data=>{
                if (data.success)
                {
                    if(formName==='register'||formName==='login'||formName==='check')
                    {
                        tokenHandler.addHeaderToken(data.token)
                        window.localStorage.setItem('user', data.user)
                        location.reload()
                    }
                    else
                    {
                        tokenHandler.deleteHeaderToken()
                        location.reload()
                    }
                }
                else
                {   
                    if(hasErrors)
                    {
                        let errorObjects = errorHandler.getInputErrors(data, formName)
                        htmlHandler.inputErrorMessage(errorObjects)
                    }
                }
            })
            
        })
    }
    const taskForm = (type, method, taskID, projectID, parentElement)=>
    {
        if (method=="POST")
        {  
            let body = formHandler.getFormValues("task")
            body["project"] = projectID
            body["pub_date"] = new Date().toISOString().split('T')[0]
            
            apiCaller.postCall("task-", type, body)
            .then(data=>{
                dataHandler.tasks.push(data)
                let taskItem = indexPage.generateTaskItem("item", data)
                document.querySelector(`.task-list`).appendChild(taskItem)
                indexPage.addBtnEvents.taskItemBtnEvents(taskItem)
                
            })
            .then(()=>indexPage.deleteItem('task', 'form'))
        }
        else if(method=="DELETE")
        {
            apiCaller.deleteCall('task-',"delete", taskID)
        }
        else if(method=="PUT")
        {
            if(type=='update')
            {
                let body = formHandler.getFormValues("task", taskID)
                body["project"] = projectID
                apiCaller.putCall('task-',"update", body, taskID)
                .then((data)=>{
                    let index = dataHandler.tasks.findIndex(task=>task.pk==taskID)
                    dataHandler.tasks[index]=data
                    let taskItem = indexPage.generateTaskItem("item", data)
                    document.querySelector(`#task-form-${taskID}`).after(taskItem)
                    indexPage.addBtnEvents.taskItemBtnEvents(taskItem)
                })
                .then(()=>indexPage.deleteItem('task', 'form', true, taskID))
            }
            else
            {
                let body = {}
                body['title'] = parentElement.querySelector('.task-title').innerHTML
                body['due'] = parentElement.querySelector('.task-due i').innerHTML
                body['completed']= parentElement.querySelector('.task-check input').checked
                body["project"] = projectID
                apiCaller.putCall('task-',"update", body, taskID)
                .then((data)=>{
                    let index = dataHandler.tasks.findIndex(task=>task.pk==taskID)
                    dataHandler.tasks[index]=data
                    console.log(data)
                })
            }
               
        }
    }

    const projectForm = (type, method, projectID, parentElement)=>{
        if (method=="POST")
        {
            let body = formHandler.getFormValues("project")
            apiCaller.postCall("project-", type, body)
            .then(data=>{
                dataHandler.projects.push(data)
                let projectItem = indexPage.generateProjectItem("item", data)
                document.querySelector(`.project-list`).appendChild(projectItem)
                indexPage.addBtnEvents.projectItemBtnEvents(projectItem)
                
            })
            .then(()=>indexPage.deleteItem('project ', 'form'))
        }
        else if (method=="DELETE")
        {
            apiCaller.deleteCall('project-',"delete", projectID)
        }
        else if(method=="PUT")
        {
                let body = formHandler.getFormValues("project", projectID)
                let isActive = parentElement.classList.contains('active')
                apiCaller.putCall('project-',"update", body, projectID)
                .then((data)=>{
                    let index = dataHandler.projects.findIndex(project=>project.pk==projectID)  
                    dataHandler.projects[index]=data
                    if(isActive)
                    {
                        document.querySelector('#task-header-main').innerHTML = data.title
                        document.querySelector('#task-header-sub').innerHTML = data.description
                    }
                    let projectItem = indexPage.generateProjectItem("item", data)
                    if (parentElement.classList.contains('active')){projectItem.classList.add('active')}
                    console.log(document.querySelector(`#project-form-${projectID}`))
                    document.querySelector(`#project-form-${projectID}`).after(projectItem)
                    indexPage.addBtnEvents.projectItemBtnEvents(projectItem)
                })
                .then(()=>indexPage.deleteItem('project', 'form', true, projectID))

        }

    }

    return {authenticationForm, startingPage, taskForm, projectForm, changePage}
})()

export default functionInterface