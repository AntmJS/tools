# 遍历文件夹内的文件和所有子目录
for file in $(find "./dist" -type f -name "*.js"); do
  npx terser "$file" -c arguments,arrows=true -m toplevel,keep_classnames,keep_fnames -o "$file"
done

cp -rf ./src/templates ./dist
