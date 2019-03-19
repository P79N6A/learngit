/**
 * Created by 自羽 on 2017/6/30.
 */

module.exports = function (grunt) {
  return {
    exec: {
      tag: {
        command: 'git tag publish_<%= currentBranch %>  -m "Clam Build: <%= currentBranch %>"',
      },
      publish: {
        command: 'git push origin publish_<%= currentBranch %>:publish_<%= currentBranch %>',
      },
      commit: {
        command(msg) {
          return `git commit -m "${msg}"`;
        },
      },
      add: {
        command: 'git add . -A',
      },
      build: {
        command: 'npm run build',
      },
      prepub: {
        command: 'git push origin daily/<%= currentBranch %>',
      },
        // 切新分支
      new_branch: {
        command: 'git checkout -b daily/<%= currentBranch %>',
      },
      npm_outdated: {
        command: 'npm outdated --long --registry=http://registry.npm.alibaba-inc.com',
      },
      daily_tag: {
        command(msg) {
          const tag = `daily_${grunt.config.get('currentBranch')}_${grunt.template.today('yyyymmddHHMMss')}`;
          grunt.log.write((`New Tag: ${tag}`).green);
          grunt.config.set('tag', tag);
          return `git tag ${tag} -m "Clam Build: ${grunt.config.get('currentBranch')} - ${grunt.template.today('yyyy-mm-dd hh:MM:ss')}"`;
        },
      },
      push_tag: {
        command(msg) {
          const tag = grunt.config.get('tag');
          grunt.log.write((`Prepub Tag: ${tag}`).green);
          return `git push origin ${tag}`;
        },
      },
    },
  };
};


