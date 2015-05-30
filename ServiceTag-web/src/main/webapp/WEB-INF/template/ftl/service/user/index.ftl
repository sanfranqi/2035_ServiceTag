<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '用户管理'></@inc.header>

<@inc.body 'page-open page-manage-user'>

    <div class="content content-col">
        <div class="content-in">

            <#-- 左侧导航 开始 -->
            <@sidebar.nav 'user'></@sidebar.nav>
            <#-- 左侧导航 结束 -->

            <#-- 右侧内容 开始 -->
            <div class="main" id="J_Main">
                <div class="service-box">
                    <div class="pic-box"><img src="${imageURL}/${simpleServiceTagVo.serviceTagImg}?w=56&h=56" alt="" width="56" height="56"></div>
                    <h2 class="tit">${simpleServiceTagVo.serviceTagName}</h2>
                    <a href="${urlUserIndex}" class="comm-btn btn-l btn-service fr">切换服务号</a>
                </div>
                <div class="top-box">
                    <div class="tit fl" id="J_UserGroup_Name">好友组</div>
                    <a href="javascript:;" class="btn-edit-group fl" title="编辑分组" id="J_UserGroup_Edit" style="display:none;"><i class="ico ico-edit-group"></i></a>
                    <a href="javascript:;" class="btn-del-group fl" title="删除分组" id="J_UserGroup_Del" style="display:none;"><i class="ico ico-del-group"></i></a>
                    <div class="move-box fr">
                        <select id="J_Select" style="width:200px;"><option></option></select>
                    </div>
                    <div class="search-box fr">
                        <form id="J_Form">
                            <input type="text" name="nickName" class="form-control search-text" maxlength="32" placeholder="请输入用户昵称" />
                            <input type="submit" class="search-btn" value="搜索" />
                        <form>
                    </div>
                </div>
                <div class="pn" id="J_List"></div>
            </div>
            <#-- 右侧内容 结束 -->
        </div>
    </div>

</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/service/user/main.js');
    </script>
</@inc.footer>