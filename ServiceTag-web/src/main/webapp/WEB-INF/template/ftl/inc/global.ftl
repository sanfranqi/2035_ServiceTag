<#--<#global ENV = 'development'>-->
<#global ENV = 'testing'>
<#--<#global ENV = 'production'>-->

<#if ENV == 'development'>
    <#global jsRoot = '${ctx}/js'>
    <#global seaRoot = '${ctx}/sea-modules'>
<#elseif ENV == 'testing'>
    <#global cdn = 'http://10.5.26.152:8080'>
    <#global jsRoot = '${cdn}/fed/dist/js'>
    <#global seaRoot = '${cdn}/fed/dist/js'>
<#else>
    <#global cdn = 'http://ue.17173cdn.com/a/2035/open/2014'>
    <#global jsRoot = '${cdn}/js'>
    <#global seaRoot = '${cdn}/js'>
</#if>

<#global version = '20141215113000'>

<#global urlIndex = ctx + '/index.htm'>
<#global urlUserIndex = ctx + '/index/user.htm'>
<#global urlAdminIndex = ctx + '/index/admin.htm'>

<#if simpleServiceTagVo??>
    <#global urlServiceUser = ctx + '/' + simpleServiceTagVo.id?c + '/user.htm'>

    <#global urlServiceMessageIndex = ctx + '/' + simpleServiceTagVo.id?c + '/message/index.htm'>
    <#global urlServiceMessageGroup = ctx + '/' + simpleServiceTagVo.id?c + '/message/group.htm'>

    <#global urlServiceCustomArticle = ctx + '/' + simpleServiceTagVo.id?c + '/custom/article/list.htm'>
    <#global urlServiceCustomArticleSingle = ctx + '/' + simpleServiceTagVo.id?c + '/custom/article/single.htm'>

    <#global urlServiceCustomReward = ctx + '/' + simpleServiceTagVo.id?c + '/custom/reward/list.htm'>
    <#global urlServiceCustomRewardSingle = ctx + '/' + simpleServiceTagVo.id?c + '/custom/reward/single.htm'>
    <#global urlServiceCustomRewardReview = ctx + '/' + simpleServiceTagVo.id?c + '/custom/reward/review.htm'>
    <#global urlServiceCustomRewardFinish = ctx + '/' + simpleServiceTagVo.id?c + '/custom/reward/finish.htm'>

    <#global urlServiceCustomSurvey = ctx + '/' + simpleServiceTagVo.id?c + '/custom/survey/list.htm'>

    <#global urlServiceCustomTask = ctx + '/' + simpleServiceTagVo.id?c + '/custom/task/list.htm'>
    <#global urlServiceCustomTaskSingle = ctx + '/' + simpleServiceTagVo.id?c + '/custom/task/single.htm'>

    <#global urlServiceCustomTime = ctx + '/' + simpleServiceTagVo.id?c + '/custom/time/list.htm'>
    <#global urlServiceCustomTimeSingle = ctx + '/' + simpleServiceTagVo.id?c + '/custom/time/single.htm'>
</#if>