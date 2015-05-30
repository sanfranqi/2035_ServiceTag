<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '素材管理'>
    <script type="text/javascript">
        var listUrl = '${urlServiceCustomArticle}';
    </script>
</@inc.header>

<@inc.body 'page-open page-manage-material'>

    <div class="content content-col">
        <div class="content-in">

            <#-- 左侧导航 开始 -->
            <@sidebar.nav 'article'></@sidebar.nav>
            <#-- 左侧导航 结束 -->

            <#-- 右侧内容 开始 -->
            <div class="main">

                <div class="service-box service-box-ex3">
                    <div class="pic-box"><img src="${imageURL}/${simpleServiceTagVo.serviceTagImg}?w=56&h=56" alt="" width="56" height="56"></div>
                    <h1 class="tit">${simpleServiceTagVo.serviceTagName}</h1>
                    <a href="${urlServiceCustomArticle}" class="comm-btn btn-l btn-service fr">返回</a>
                </div>

                <div class="pn pn-custom" id="J_Main"></div>

            </div>
            <#-- 右侧内容 结束 -->
        </div>
    </div>

</@inc.body>

<@inc.footer>
<#--
    <script type="text/javascript" src="${jsRoot}/kindeditor/kindeditor-min.js"></script>
    <script type="text/javascript" src="${jsRoot}/kindeditor/lang/zh_CN.js"></script>
-->
    <script type="text/javascript" src="${jsRoot}/ueditor/ueditor.config.js"></script>
    <script type="text/javascript" src="${jsRoot}/ueditor/ueditor.all.min.js"></script>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/service/custom/article/single/main.js');
    </script>
</@inc.footer>