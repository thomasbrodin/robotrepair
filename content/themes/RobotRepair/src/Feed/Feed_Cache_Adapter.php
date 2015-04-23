<?php
/*****************************************************************************
 * Copyright (c) 2011 IOWA, llc dba Wiredrive
 * Author J.O.D. (Joint Operations/Development)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ****************************************************************************/

/**
 * Simple caching mechanism to store data into arbitrary files on disk.  The
 * cache directory can be specified else all files are stored relative to the
 * current working directory.  Files are stored as md5's of their corresponding
 * url and the file's modified date is used to determine if the file needs to
 * be updated.
 */
class Feed_Cache_Adapter 
{
    /**
     * Cache Dir
     * The current directory to write files
     * @var string
     */
    protected $cacheDir = null;

    /**
     * Constructor
     *
     * @param   string      $cacheDir
     */
    public function __construct($cacheDir = 'cache')
    {
        $this->cacheDir = $cacheDir;
    }

    /**
     * @param   string      $cacheDir
     * @return  Feed_Cache_Adapter
     */
    public function setCacheDir($cacheDir)
    {
        $this->cacheDir = $cacheDir;
        return $this;
    }
    
    /**
     * @return  string
     */
    public function getCacheDir()
    {
        return $this->cacheDir;
    }

    /**
     * Get Data
     * Retrieves data for the provided string.  If the file is not found then
     * false is returned.
     *
     * @param   string      $cacheKey
     * @return  string
     */
    public function getData($cacheKey)
    {
        $filePath = $this->getFilePath($cacheKey);
        if (! file_exists($filePath)) {
            return false;
        }

        return file_get_contents($filePath);
    }

    /**
     * Update Cache
     * Write the contents for the specified cache key.  If the expected
     * directory doesn't exist, it will be created.
     *
     * @param   string      $cacheKey
     * @param   string      $contents
     * @return  bool
     */
    public function updateCache($cacheKey, $contents)
    {

        $cacheDir = $this->getCacheDir();
        if (! file_exists($cacheDir)) {
            $recursive  = true;
            $result     = @mkdir($cacheDir, 0775, $recursive);
            if (false == $result) {
                error_log('Failure creating cache directory');
                return false;
            }
        }

        $filePath = $this->getFilePath($cacheKey);
        $result = @file_put_contents($filePath, $contents);
        if (false === $result) {
            error_log('Failure creating cache file');
            return false;
        }
        return true;
    }

    /**
     * Is Stale
     * Check if the cache key's file is stale based on the time offset
     *
     * @param   string  $cacheKey
     * @param   int     $timeOffset     time in seconds
     */
    public function isStale($cacheKey, $timeOffset)
    {
        $filePath = $this->getFilePath($cacheKey);
        if (! file_exists($filePath)) {
            return true;
        }

        $modifiedTime = filemtime($filePath);
        return (($modifiedTime + $timeOffset) <= time());
    }

    /**
     * Get the full path of the cache key
     *
     * @param   string      $cacheKey
     * @return  string
     */
    public function getFilePath($cacheKey)
    {
        $fileName = $this->getFileName($cacheKey);
        return $this->getCacheDir() . '/' . $fileName;
    }

    /**
     * Convert the key to some unique file name
     * 
     * @param   string      $cacheKey
     * @return  string
     */
    public function getFileName($cacheKey)
    {
        return md5($cacheKey);
    }
}
