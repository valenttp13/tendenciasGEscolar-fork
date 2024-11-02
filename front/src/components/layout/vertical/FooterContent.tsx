'use client'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import themeConfig from '@configs/themeConfig'

const FooterContent = () => {
  // Hooks

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span>{`© ${themeConfig.templateName} ${new Date().getFullYear()}`}</span>
      </p>
    </div>
  )
}

export default FooterContent
